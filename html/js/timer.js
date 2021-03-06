
var counting = new (function() {
    var $countdown,
        $form, // Form used to change the countdown time
        incrementTime = 70,
        currentTime = 1575,
        updateTimer = function() {
            $countdown.html(formatTime(currentTime));
            if (currentTime == 0) {
                counting.Timer.stop();
                timerComplete();
                counting.resetCountdown();
                return;
            }
            currentTime -= incrementTime / 10;
            if (currentTime < 0) currentTime = 0;
        },
        timerComplete = function() {
            //alert('Example 2: Countdown timer complete!');
			$(".plank .options").hide();
        },
        init = function() {
            $countdown = $('#countdown');
			//setTimeout(function(){
            counting.Timer = $.timer(updateTimer, incrementTime, true);
			//},49000);
        };
		this.resetCountdown = function() {
			var newTime = parseInt($form.find('input[type=text]').val()) * 100;
			if (newTime > 0) {currentTime = newTime;}
			this.Timer.stop().once();
		};
    $(init);
});

// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return pad(sec, 2);
}
