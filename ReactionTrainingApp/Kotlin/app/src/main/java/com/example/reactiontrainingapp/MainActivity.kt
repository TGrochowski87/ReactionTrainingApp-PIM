package com.example.reactiontrainingapp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.widget.Button
import android.widget.ImageButton
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat
import androidx.core.widget.addTextChangedListener
import com.google.android.material.button.MaterialButton
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.slider.LabelFormatter
import com.google.android.material.slider.Slider
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class MainActivity : AppCompatActivity() {

    lateinit var trainingLauncher : ActivityResultLauncher<Intent>

    lateinit var toolbar : Toolbar

    lateinit var textInputName : TextInputLayout
    lateinit var textInputEditName : TextInputEditText
    lateinit var difficultySlider : Slider
    lateinit var themeButtons : Array<ImageButton>
    lateinit var themes : Array<Theme>


    lateinit var theme1 : ImageButton
    lateinit var theme2 : ImageButton
    lateinit var theme3 : ImageButton
    lateinit var theme4 : ImageButton
    lateinit var theme5 : ImageButton

    lateinit var activeThemeButton : ImageButton

    var activeTheme = 0
    var difficultyTime = 800L
    var pointsOnHit = 1

    lateinit var startButton : Button
    lateinit var leaderboardButton : MaterialButton
    lateinit var aboutButton : MaterialButton

    lateinit var userName : String

    fun sliderToString(value : Float) : String {
        when (value.toInt()){
            0 -> return "EASY\nTime to click: 800ms"
            1 -> return "MEDIUM\nTime to click: 500ms"
            2 -> return "HARD\nTime to click: 300ms"
            else -> return "EASY\nTime to click: 800ms"
        }
    }

    fun sliderToTime(value : Float) :  Long {
        when (value.toInt()){
            0 -> return 800L
            1 -> return 500L
            2 -> return 300L
            else -> return 800L
        }
    }

    fun sliderToPointsOnHit(value : Float) : Int {
        when (value.toInt()){
            0 -> return 1
            1 -> return 2
            2 -> return 3
            else -> return 1
        }
    }

    val aboutText = "Game starts after a short countdown.\n" +
            "\n" +
            "Tap the glowing square as fast as you\n" +
            "can to get the points.\n" +
            "The higher defficulty you choose, the\n" +
            "more points you get!\n" +
            "Any missclicks will cost you 1 point\n" +
            "\n" +
            "Game ends after 20 attempts.\n" +
            "The fastest and most precise players\n" +
            "will be featured on the leaderboard."

    override fun /*zabawa :D*/ onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.mainToolbar))

        toolbar = findViewById(R.id.mainToolbar)
        toolbar.setNavigationOnClickListener {
            var leaderboardIntent = Intent(this, LeaderboardActivity::class.java)
            startActivity(leaderboardIntent)
        }

        userName = "Anonymous"

        textInputName = findViewById(R.id.textInputName)
        textInputEditName = findViewById(R.id.textInputEditName)
        difficultySlider = findViewById(R.id.difficultySlider)
        theme1 = findViewById(R.id.theme1)
        theme2 = findViewById(R.id.theme2)
        theme3 = findViewById(R.id.theme3)
        theme4 = findViewById(R.id.theme4)
        theme5 = findViewById(R.id.theme5)

        themeButtons = arrayOf(
            theme1,
            theme2,
            theme3,
            theme4,
            theme5
        )

        startButton = findViewById(R.id.StartButton)
        leaderboardButton = findViewById(R.id.buttonLeaderboard)
        aboutButton = findViewById(R.id.buttonAbout)

        themes = arrayOf(
            Theme(ContextCompat.getColor(this, R.color.green), ContextCompat.getColor(this, R.color.red)),
            Theme(ContextCompat.getColor(this, R.color.blue_700), ContextCompat.getColor(this, R.color.yellow_700)),
            Theme(ContextCompat.getColor(this, R.color.pink_300), ContextCompat.getColor(this, R.color.purple_800)),
            Theme(ContextCompat.getColor(this, R.color.blue_400), ContextCompat.getColor(this, R.color.pink_300)),
            Theme(ContextCompat.getColor(this, R.color.yellow_700), ContextCompat.getColor(this, R.color.purple_800))
        )

        activeThemeButton = theme1
        theme1.setBackgroundColor(ContextCompat.getColor(this, R.color.blue_500))

        textInputName.placeholderText = "Anonymous"
        textInputEditName.addTextChangedListener( object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {}
            override fun onTextChanged(s: CharSequence?, p1: Int, p2: Int, p3: Int) {
                userName = s.toString()
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        leaderboardButton.setOnClickListener{
            var leaderboardIntent = Intent(this, LeaderboardActivity::class.java)
            startActivity(leaderboardIntent)
        }

        aboutButton.setOnClickListener{
            MaterialAlertDialogBuilder(this)
                .setTitle("About")
                .setMessage(aboutText)
                .setPositiveButton("OK") { dialog, which ->
                }
                .show()
        }


        themeButtons.forEachIndexed{ index, it ->
            it.setOnClickListener { it1 ->
                if (activeThemeButton != it1) {
                    activeThemeButton.setBackgroundColor(ContextCompat.getColor(this, R.color.black))
                    activeThemeButton = it1 as ImageButton
                    it1.setBackgroundColor(ContextCompat.getColor(this, R.color.blue_500))
                    activeTheme = index
                }
            }
        }

        difficultySlider.setLabelFormatter( LabelFormatter {
            sliderToString(it)
        })
        difficultySlider.addOnChangeListener { slider, value, fromUser ->
            difficultyTime = sliderToTime(value)
            pointsOnHit = sliderToPointsOnHit(value)
        }

        startButton.setOnClickListener {
            var trainingIntent = Intent(this, TrainingActivity::class.java)
            trainingIntent.putExtra("username", userName)
            trainingIntent.putExtra("active", themes[activeTheme].active)
            trainingIntent.putExtra("inactive", themes[activeTheme].inactive)
            trainingIntent.putExtra("difficulty", difficultyTime)
            trainingIntent.putExtra("pointsOnHit", pointsOnHit)

            trainingLauncher.launch(trainingIntent)
        }

        leaderboardButton.setOnClickListener{
            val leaderboardsIntent = Intent(this, LeaderboardActivity::class.java)
            startActivity(leaderboardsIntent)
        }

        trainingLauncher = this.registerForActivityResult(ActivityResultContracts.StartActivityForResult()){

        }


    }
}