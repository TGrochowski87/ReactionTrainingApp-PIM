package com.example.reactiontrainingapp

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.widget.Toolbar

class LeaderboardActivity : AppCompatActivity() {

    lateinit var toolbar : Toolbar

    lateinit var firstPointsField : TextView
    lateinit var firstUsernameField : TextView

    lateinit var secondPointsField : TextView
    lateinit var secondUsernameField : TextView

    lateinit var thirdPointsField : TextView
    lateinit var thirdUsernameField : TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_leaderboard)

        toolbar = findViewById(R.id.mainToolbar)
        toolbar.setNavigationOnClickListener {
            this.finish()
        }

        firstPointsField = findViewById(R.id.firstPoints)
        firstUsernameField = findViewById(R.id.firstUsername)

        secondPointsField = findViewById(R.id.secondPoints)
        secondUsernameField = findViewById(R.id.secondUsername)

        thirdPointsField = findViewById(R.id.thirdPoints)
        thirdUsernameField = findViewById(R.id.thirdUsername)

        val prefs = getSharedPreferences(getString(R.string.prefs_key), Context.MODE_PRIVATE)

        val first = (prefs.getString("first", "NoData:0") ?: "NoData1:0").split(":")
        val second = (prefs.getString("second", "NoData:0") ?: "NoData2:0").split(":")
        val third = (prefs.getString("third", "NoData:0") ?: "NoData3:0").split(":")

        val firstUsername = first.get(0)
        val secondUsername = second.get(0)
        val thirdUsername = third.get(0)

        val firstPoints = first.get(1)
        val secondPoints = second.get(1)
        val thirdPoints = third.get(1)

        firstPointsField.text = firstPoints
        firstUsernameField.text = firstUsername

        secondPointsField.text = secondPoints
        secondUsernameField.text = secondUsername

        thirdPointsField.text = thirdPoints
        thirdUsernameField.text = thirdUsername


    }
}