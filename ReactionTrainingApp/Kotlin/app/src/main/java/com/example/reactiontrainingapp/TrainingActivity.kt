package com.example.reactiontrainingapp

import android.content.Context
import android.content.SharedPreferences
import android.opengl.Visibility
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.CountDownTimer
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat
import java.util.*
import java.util.TimerTask

class TrainingActivity : AppCompatActivity() {


    lateinit var infoText : TextView

    lateinit var button1 : ImageButton
    lateinit var button2 : ImageButton
    lateinit var button3 : ImageButton
    lateinit var button4 : ImageButton
    lateinit var button5 : ImageButton
    lateinit var button6 : ImageButton
    lateinit var button7 : ImageButton
    lateinit var button8 : ImageButton
    lateinit var button9 : ImageButton
    lateinit var gameButtons : Array<ImageButton>

    lateinit var playAgainButton : Button

    var activeColor = 0
    var inactiveColor = 0
    var difficulty = 800L
    var pointsOnHit = 1
    var username = "Anonymous"

    var currentButtonIndex = 10

    var random = Random()
    lateinit var timer : Timer
    lateinit var gameTimer : Timer
    var attempts = 5
    var startCountdown = 3
    var points = 0
    var gameInProgress = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_training)

        activeColor = intent.getIntExtra("active", ContextCompat.getColor(this, R.color.green))
        inactiveColor = intent.getIntExtra("inactive", ContextCompat.getColor(this, R.color.red))
        difficulty = intent.getLongExtra("difficulty", 800L)
        username = intent.getStringExtra("username") ?: "Anonymous"
        pointsOnHit = intent.getIntExtra("pointsOnHit", 1)

        var toolbar = findViewById<Toolbar>(R.id.mainToolbar)
        toolbar.setNavigationOnClickListener { this.finish() }

        infoText = findViewById(R.id.infoText)

        button1 = findViewById(R.id.button1)
        button2 = findViewById(R.id.button2)
        button3 = findViewById(R.id.button3)
        button4 = findViewById(R.id.button4)
        button5 = findViewById(R.id.button5)
        button6 = findViewById(R.id.button6)
        button7 = findViewById(R.id.button7)
        button8 = findViewById(R.id.button8)
        button9 = findViewById(R.id.button9)

        gameButtons = arrayOf( button1, button2, button3, button4, button5,
            button6, button7, button8, button9)

        playAgainButton = findViewById(R.id.buttonPlayAgain)
        playAgainButton.setOnClickListener{
            startCountdownTimer()
        }

        playAgainButton.visibility = View.INVISIBLE

        gameButtons.forEachIndexed { index, it ->
            it.setBackgroundColor(inactiveColor)
            it.setOnClickListener { it1 ->
                if (gameInProgress) {
                    if (index == currentButtonIndex) {
                        points += pointsOnHit
                        it.setBackgroundColor(inactiveColor)
                        currentButtonIndex = 10
                    } else {
                        points--
                    }
                    setInfoText(getString(R.string.points_text, points))
                }
            }
        }

        startCountdownTimer()
    }

    fun setInfoText(text : String){
        infoText.text = text
    }

    inner class CountDownTask() : TimerTask() {
        override fun run() {
            runOnUiThread {
                if (startCountdown == 0) {
                    startGameTimer()
                    timer.cancel()
                } else {
                    startCountdown--
                    setInfoText(getString(R.string.starting_text, startCountdown))
                }
            }
        }

    }

    inner class GameTask : TimerTask() {
        override fun run() {
            runOnUiThread {
                if (attempts == 0) {
                    saveScore(points)
                    gameInProgress = false
                    playAgainButton.visibility = View.VISIBLE
                    setInfoText(getString(R.string.ending_text, points))
                    gameTimer.cancel()
                } else {
                    currentButtonIndex = random.nextInt(9)
                    gameButtons[currentButtonIndex].setBackgroundColor(activeColor)

                    var tickTimer = object : CountDownTimer(difficulty, 100) {
                        override fun onTick(tick: Long) {}
                        override fun onFinish() {
                            if (currentButtonIndex != 10)
                                gameButtons[currentButtonIndex].setBackgroundColor(inactiveColor)
                            currentButtonIndex = 10
                        }
                    }.start()

                    attempts--
                }
            }
        }

    }

    private fun startCountdownTimer(){
        playAgainButton.visibility = View.INVISIBLE
        points = 0
        startCountdown = 3
        attempts = 5
        setInfoText(getString(R.string.starting_text, startCountdown))
        timer = Timer()
        timer.schedule(CountDownTask(),1000, 1000)
    }

    private fun startGameTimer(){
        gameInProgress = true
        setInfoText(getString(R.string.points_text, points))
        gameTimer = Timer()
        gameTimer.schedule(GameTask(), 2000, 2000)
    }

    private fun saveScore(points : Int) {
        val prefs = getSharedPreferences(getString(R.string.prefs_key), Context.MODE_PRIVATE)
        val third = prefs.getString("third", "NoData:0") ?: "NoData:0"
        val second = prefs.getString("second", "NoData:0") ?: "NoData:0"
        val first = prefs.getString("first", "NoData:0") ?: "NoData:0"
        val thirdUsername = third.split(":").get(0)
        val secondUsername = second.split(":").get(0)
        val firstUsername = first.split(":").get(0)
        val thirdPoints = third.split(":").get(1).toInt()
        val secondPoints = second.split(":").get(1).toInt()
        val firstPoints = first.split(":").get(1).toInt()

        Log.v("lul", "${points}-${firstPoints}-${secondPoints}-${thirdPoints}")
        val editor = prefs.edit()

        if (points > thirdPoints) {
            if (points > secondPoints) {
                if (points > firstPoints) {
                    editor.putString("first", username+":"+points)
                    editor.putString("second", firstUsername+":"+firstPoints)
                    editor.putString("third", secondUsername+":"+secondPoints)
                        Log.v("xddfirst", username+":"+points)
                } else {
                    editor.putString("second", username+":"+points)
                    editor.putString("third", secondUsername+":"+secondPoints)
                    Log.v("xddsecond", username+":"+points)
                }
            } else {
                editor.putString("third", username+":"+points)
                Log.v("xddthird", username+":"+points)
            }
        } else Log.v("xddbad", username+":"+points)
        editor.apply()

    }


}