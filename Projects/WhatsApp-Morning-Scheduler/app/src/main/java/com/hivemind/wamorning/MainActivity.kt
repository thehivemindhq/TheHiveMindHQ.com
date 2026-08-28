package com.hivemind.wamorning

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.hivemind.wamorning.ui.LogScreen
import com.hivemind.wamorning.ui.SettingsScreen
import com.hivemind.wamorning.ui.theme.WaMorningTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WaMorningTheme {
                val navController = rememberNavController()
                Scaffold(modifier = Modifier.fillMaxSize()) { padding ->
                    NavHost(
                        navController = navController,
                        startDestination = "settings",
                        modifier = Modifier.padding(padding)
                    ) {
                        composable("settings") {
                            SettingsScreen(onOpenLog = { navController.navigate("log") })
                        }
                        composable("log") {
                            LogScreen(onBack = { navController.popBackStack() })
                        }
                    }
                }
            }
        }
    }
}
