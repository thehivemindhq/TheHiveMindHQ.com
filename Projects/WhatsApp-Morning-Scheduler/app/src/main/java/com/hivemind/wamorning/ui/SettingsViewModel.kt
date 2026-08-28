package com.hivemind.wamorning.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hivemind.wamorning.data.AppSettings
import com.hivemind.wamorning.data.SettingsRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class SettingsViewModel(private val repository: SettingsRepository) : ViewModel() {

    val settings: StateFlow<AppSettings> = repository.settingsFlow.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = AppSettings(),
    )

    fun addGroup(name: String) {
        val trimmed = name.trim()
        if (trimmed.isEmpty() || trimmed in settings.value.groups) return
        viewModelScope.launch { repository.setGroups(settings.value.groups + trimmed) }
    }

    fun removeGroup(name: String) {
        viewModelScope.launch { repository.setGroups(settings.value.groups - name) }
    }

    fun setTemplate(template: String) {
        viewModelScope.launch { repository.setTemplate(template) }
    }

    fun setTime(hour: Int, minute: Int) {
        viewModelScope.launch { repository.setTime(hour, minute) }
    }

    fun setEnabled(enabled: Boolean) {
        viewModelScope.launch { repository.setEnabled(enabled) }
    }
}
