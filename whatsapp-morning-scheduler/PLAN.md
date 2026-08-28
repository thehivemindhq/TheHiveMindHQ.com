# PLAN.md — WhatsApp Morning Message Scheduler (personal, sideload-only)

## What this is
A single-user Android app for a Galaxy Z Fold 8 (current One UI) that, every
morning at a configurable time (default 06:00), opens WhatsApp and sends a
"good morning" message to a fixed list of group chats. WhatsApp has no API
for personal accounts, so this works by driving the real WhatsApp UI through
an `AccessibilityService` — the same mechanism screen readers use: find
on-screen elements by id/text/content-description, set text, tap "Send".
It never uses a private API, and it is never going on the Play Store.

Repo note: this lives in `whatsapp-morning-scheduler/` at the repo root
(the Android Studio project root), kept separate from the site's
`Projects/` folder, which holds single-file HTML showcase pieces, not a
Gradle/Kotlin toolchain project. Say if you'd rather it live elsewhere.

## High-level architecture

```
AlarmManager (exact, allow-while-idle)
      │  fires daily at HH:mm
      ▼
AlarmReceiver (BroadcastReceiver)
      │  starts foreground service, reschedules tomorrow's alarm
      ▼
MorningMessageService (foreground service)
      │  1. partial+screen wake lock, turn screen on
      │  2. check keyguard: if locked & secure → notify "unlock to send",
      │     poll for up to 5 min, else proceed
      │  3. launch WhatsApp (explicit package, not a share intent)
      │  4. for each configured group: hand a "SendJob" to the
      │     accessibility service, await result with timeout
      │  5. write outcomes to Room, post summary notification
      │  6. release wake lock
      ▼
WhatsAppAccessibilityService (AccessibilityService)
      │  runs in the same app process (not isolated), so it talks to the
      │  service via an in-process singleton (Kotlin object + StateFlow /
      │  Channel) — no AIDL/Messenger needed.
      • find chat: search chat-list rows by text == group name;
        if not visible, tap WhatsApp's search icon, type the name,
        open the first result
      • find compose box by view id (verified against a live node dump,
        see README) → ACTION_SET_TEXT with the rendered message
      • find send button by content-description ("Send") → ACTION_CLICK
      • verify sent: poll for the outgoing bubble / the compose box
        clearing, within a timeout; treat "can't find it" as a soft
        failure (logged), never a fallback tap at guessed coordinates
BootReceiver (BOOT_COMPLETED) → re-arms the alarm after reboot, since
      exact alarms do not survive a reboot on their own.
```

## Files (initial layout)

```
whatsapp-morning-scheduler/
  settings.gradle.kts
  build.gradle.kts
  gradle/libs.versions.toml
  app/
    build.gradle.kts
    src/main/
      AndroidManifest.xml
      java/com/hivemind/wamorning/
        MainActivity.kt                  // Compose host, nav between Settings/Log
        ui/
          SettingsScreen.kt              // groups list, template, time picker, toggle, "Send test now"
          LogScreen.kt                   // last 30 runs
          theme/Theme.kt
        data/
          SettingsRepository.kt          // Preferences DataStore
          RunLogEntity.kt                // Room entity: run id, timestamp, group, outcome, reason
          RunLogDao.kt
          AppDatabase.kt
        alarm/
          AlarmScheduler.kt              // schedule/cancel exact alarm, computes next 06:00
          AlarmReceiver.kt               // BroadcastReceiver: starts service, reschedules
          BootReceiver.kt                // BOOT_COMPLETED → AlarmScheduler.reschedule()
        service/
          MorningMessageService.kt       // foreground service, orchestrates the run
          ScreenWaker.kt                 // wake lock + keyguard check helpers
        accessibility/
          WhatsAppAccessibilityService.kt
          SendJob.kt                     // group name + rendered message
          SendResult.kt                  // Success / NotFound / Timeout / Error(reason)
          Selectors.kt                   // ALL view-id/content-desc/text constants, isolated here
        notify/
          Notifications.kt               // channels: run summary, unlock-needed (high priority)
      res/
        values/strings.xml, themes.xml
        drawable/ (notification icon)
  README.md
  PLAN.md   (this file)
```

## Permissions (manifest)

| Permission | Why |
|---|---|
| `SCHEDULE_EXACT_ALARM` (+ `USE_EXACT_ALARM` where applicable) | precise 06:00 firing; on Android 13+ this is a user-grantable toggle in Settings, not auto-granted — app must detect and send the user to `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` |
| `POST_NOTIFICATIONS` | required at runtime (Android 13+) for the summary/unlock notifications |
| `RECEIVE_BOOT_COMPLETED` | re-arm the alarm after reboot |
| `FOREGROUND_SERVICE` + `FOREGROUND_SERVICE_SPECIAL_USE` | the send run is a foreground service; Android 14+ requires a declared FGS type and a `<property>` justification string for `SPECIAL_USE` (no built-in type fits "drive another app's UI") |
| `WAKE_LOCK` | turn screen on / keep CPU awake during the short send run |
| `BIND_ACCESSIBILITY_SERVICE` | declared on the service itself (system-enforced), not requested from the user directly — the user enables the service in Settings |
| `<queries package="com.whatsapp">` | package-visibility entry (Android 11+) so the app can check WhatsApp is installed and launch it explicitly |

No `INTERNET`, no `QUERY_ALL_PACKAGES`.

`compileSdk`/`targetSdk`: my knowledge cutoff is Jan 2026 and it's now Aug
2026, so I'll set these to the latest **stable** API level shown in your
Android Studio SDK Manager when you first open the project rather than
guess a number that may already be outdated — I'll flag the exact line to
check in README.

## Data storage choice

- **Preferences DataStore** for settings (group list, message template,
  scheduled time, enabled toggle) — it's a handful of scalar/JSON values
  with no querying needs, and DataStore is the current recommended
  replacement for SharedPreferences.
- **Room** for the run log — it's tabular, append-only, and needs
  "give me the last 30 ordered by time" — a `LIMIT 30` DAO query is far
  simpler and safer than hand-rolling that over a JSON blob in DataStore.

## Known risks (read before saying "go")

1. **WhatsApp UI churn.** Every selector (view id, content-description)
   lives in one file, `Selectors.kt`, specifically so a WhatsApp update
   only requires editing constants there. README explains how to re-dump
   IDs when something breaks.
2. **Sideload "restricted settings" lock (Android 13+).** Because this
   APK is installed outside an app store, Android greys out the
   Accessibility toggle for it by default. You'll need one extra manual
   step (App info → ⋮ → "Allow restricted settings") before you can even
   turn the service on — this is a Google anti-malware measure, not
   something the app can or should bypass programmatically.
3. **Secure lock screen.** The app cannot and will not attempt to unlock
   a secured device (no root, no accessibility-based lock bypass — that
   would itself look like malware and is explicitly out of scope). If
   the phone is locked at 06:00, it turns the screen on, posts a
   high-priority "please unlock" notification, and polls for up to 5
   minutes before giving up and logging a failure.
4. **OEM battery/idle killers (One UI "Deep sleep" / "Put unused apps to
   sleep" / "Sleeping apps").** These can silently prevent the alarm's
   foreground service or the accessibility service from running. The app
   can request the standard battery-optimization exemption dialog, but
   the One UI-specific sleeping-apps list has no public API — you'll
   need to exempt it by hand (checklist comes after step 3, once the
   accessibility service exists, per your request).
5. **Exact alarms can still be delayed** by Doze in rare cases even with
   `setExactAndAllowWhileIdle`; this is an OS guarantee limitation, not a
   bug in the app.
6. **Automation-detection / account risk.** WhatsApp's ToS prohibits
   automated/bulk messaging, and there is a real (if low, for one message
   to a few groups a day) risk of the account being flagged. This is
   your call to accept since it's your own account and low volume, but
   worth stating plainly.
7. **AccessibilityService review friction / Play Protect warnings.**
   Sideloaded accessibility services can trigger a Play Protect warning
   on install/enable. This is expected for this kind of app and has no
   code-level fix — just something to click through knowingly on your
   own device.
8. **No official IPC needed**, but if you ever add multi-process (e.g.
   `isolatedProcess` on the accessibility service), the in-process
   singleton hand-off between service and accessibility service breaks
   and would need a real IPC mechanism. Not planned, just noting the
   coupling.

## Build order (as you requested)

1. Project skeleton — compiles, shows Settings screen (no logic yet).
2. Alarm + boot receiver — fires a notification at the scheduled time,
   proving scheduling works, before any WhatsApp automation exists.
3. Accessibility service + "Send test now" button — the riskiest,
   most WhatsApp-version-sensitive part, built and manually verified
   before wiring it into the scheduled path.
4. Full scheduled path — alarm → foreground service → accessibility
   send → verification → notification, end to end.
5. Log screen + polish.

After step 3 compiles I'll give you the full on-device settings checklist
(dev options → USB debugging → install-unknown-apps → restricted-settings
→ accessibility service → exact alarms → battery → One UI sleeping-apps),
in that order.

---

Say **go** to start on step 1, or flag anything in this plan you want
changed first (e.g. different package name, project location, or
targetSdk).
