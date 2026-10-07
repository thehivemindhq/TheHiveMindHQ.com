package com.hivemind.wamorning.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

private val Context.dataStore by preferencesDataStore(name = "settings")

data class AppSettings(
    val groups: List<String> = emptyList(),
    val messageTemplate: String = "Good morning! Hope you have a wonderful {date} 🌞",
    val hour: Int = 6,
    val minute: Int = 0,
    val enabled: Boolean = false,
)

/**
 * Settings are a handful of scalars plus one short list, with no querying
 * need, so Preferences DataStore (the current recommended replacement for
 * SharedPreferences) is enough here. The run log, which does need ordered
 * queries, uses Room instead — see data/RunLogDao.kt (added in step 5).
 */
class SettingsRepository(context: Context) {

    private val appContext = context.applicationContext

    private object Keys {
        val GROUPS_JSON = stringPreferencesKey("groups_json")
        val TEMPLATE = stringPreferencesKey("message_template")
        val HOUR = intPreferencesKey("hour")
        val MINUTE = intPreferencesKey("minute")
        val ENABLED = booleanPreferencesKey("enabled")
    }

    val settingsFlow: Flow<AppSettings> = appContext.dataStore.data.map { prefs ->
        val defaults = AppSettings()
        AppSettings(
            groups = prefs[Keys.GROUPS_JSON]?.let { Json.decodeFromString<List<String>>(it) }
                ?: defaults.groups,
            messageTemplate = prefs[Keys.TEMPLATE] ?: defaults.messageTemplate,
            hour = prefs[Keys.HOUR] ?: defaults.hour,
            minute = prefs[Keys.MINUTE] ?: defaults.minute,
            enabled = prefs[Keys.ENABLED] ?: defaults.enabled,
        )
    }

    suspend fun setGroups(groups: List<String>) {
        appContext.dataStore.edit { it[Keys.GROUPS_JSON] = Json.encodeToString(groups) }
    }

    suspend fun setTemplate(template: String) {
        appContext.dataStore.edit { it[Keys.TEMPLATE] = template }
    }

    suspend fun setTime(hour: Int, minute: Int) {
        appContext.dataStore.edit {
            it[Keys.HOUR] = hour
            it[Keys.MINUTE] = minute
        }
    }

    suspend fun setEnabled(enabled: Boolean) {
        appContext.dataStore.edit { it[Keys.ENABLED] = enabled }
    }
}
