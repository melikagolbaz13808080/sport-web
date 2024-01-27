// js for nav bar
$(window).scroll(function() {
    if ($(this).scrollTop() > 0 && $(window).width() > 992) {
        $(".navbar").addClass("nav-sticky");
    } else if ($(window).width() < 992) {
        $(".navbar").addClass("nav-sticky");
    } else $(".navbar").removeClass("nav-sticky");
});

// js for bottom to top button
$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $("#scroll").fadeIn();
        } else {
            $("#scroll").fadeOut();
        }
    });
    $("#scroll").click(function() {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});

// Calorie calculator
jQuery(function($) {
    var result = $("#result");
    var bmiResult = $("#result-bmi");
    var bmiResultIndex = $("#result-bmi-index");
    var dietSuggestion = $("#diet-suggestion");
    // اطلاعات کاربر را از Local Storage بخوان
    var savedUserData = JSON.parse(localStorage.getItem('userData')) || {};

    // اطلاعات کاربر را پر کنید اگر در Local Storage موجود است
    $("#gender").val(savedUserData.gender || "");
    $("#age").val(savedUserData.age || "");
    $("#height").val(savedUserData.height || "");
    $("#weight").val(savedUserData.weight || "");
    $("#cactivity").val(savedUserData.activity || "");

    // اگر اطلاعات از قبل در Local Storage وجود داشته باشد، یک پیغام به کاربر نشان دهید
    if (Object.keys(savedUserData).length > 0) {
        alert("اطلاعات گذشته شما بازیابی شدند. لطفاً در صورت نیاز اصلاحات لازم را اعمال کنید.");
    }

    // چک کردن و نمایش پیام به کاربر
    checkAndUpdateMessage(savedUserData);

    $("#submit").click(function() {
        // در هر بار کلیک بر روی دکمه "submit"، اطلاعات جدید کاربر را در Local Storage ذخیره کنید
        var userData = {
            gender: $("#gender").val(),
            age: parseInt($("#age").val()),
            height: parseInt($("#height").val()),
            weight: parseInt($("#weight").val()),
            activity: parseFloat($("#cactivity").val())
        };

        // اطلاعات جدید را در Local Storage ذخیره کنید
        localStorage.setItem('userData', JSON.stringify(userData));

        // چک کردن و نمایش پیام به کاربر
        checkAndUpdateMessage(userData);

        output = Infinity;

        switch (userData.gender) {
            case "male":
                msjBMR = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
                rhbBMR = 13.397 * userData.weight + 4.799 * userData.height - 5.677 * userData.age + 88.362;
                break;
            case "female":
                msjBMR = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age - 161;
                rhbBMR = 9.247 * userData.weight + 3.098 * userData.height - 4.330 * userData.age + 447.593;
                break;
            default:
                break;
        }

        BMR = (msjBMR + rhbBMR) / 2;
        output = BMR * userData.activity;

        // اعلان محاسبات به کاربر
        alert("اطلاعات شما با موفقیت ذخیره شد.");

        if (isNaN(output) || output <= 0) {
            alert("لطفاً مقادیر صحیح را پر کنید");
        } else {
            result.text(`برای حفظ وزن، اطمینان حاصل کنید که روزانه ${output.toFixed(2)} کالری دریافت می‌کنید`);

            // افزودن محاسبات مربوط به شاخص توده بدنی
            var heightInMeters = userData.height / 100;
            var bmi = userData.weight / (heightInMeters * heightInMeters);
            bmiResult.text(`شاخص توده بدنی (BMI): ${bmi.toFixed(2)}`);

            // محاسبه و نمایش پیام مربوط به وزن ایده‌آل
            var idealWeight = 21.7 * Math.pow(heightInMeters, 2);
            var weightDiff = idealWeight - userData.weight;

            if (weightDiff > 0) {
                bmiResultIndex.text(`برای رسیدن به وزن ایده‌آل، ${weightDiff.toFixed(2)} کیلوگرم وزن اضافه کنید.`);
            } else if (weightDiff < 0) {
                bmiResultIndex.text(`برای رسیدن به وزن ایده‌آل، ${Math.abs(weightDiff).toFixed(2)} کیلوگرم وزن کم کنید.`);
            } else {
                bmiResultIndex.text("وزن شما در حد وزن ایده‌آل است.");
            }

            // ارائه پیشنهاد بر اساس شاخص توده بدنی (BMI)
            suggestDietPlan(bmi);
        }
    });

    function checkAndUpdateMessage(userData) {
        // اطلاعات جدید کاربر را بررسی کنید و پیام مربوطه را نمایش دهید
        var heightInMeters = userData.height / 100;
        var bmi = userData.weight / (heightInMeters * heightInMeters);
        var idealWeight = 21.7 * Math.pow(heightInMeters, 2);
        var weightDiff = idealWeight - userData.weight;

        var bmiResult = $("#result-bmi");
        var bmiResultIndex = $("#result-bmi-index");

        bmiResult.text(`شاخص توده بدنی (BMI): ${bmi.toFixed(2)}`);

        if (weightDiff > 0) {
            bmiResultIndex.text(`برای رسیدن به وزن ایده‌آل، ${weightDiff.toFixed(2)} کیلوگرم وزن اضافه کنید.`);
        } else if (weightDiff < 0) {
            bmiResultIndex.text(`برای رسیدن به وزن ایده‌آل، ${Math.abs(weightDiff).toFixed(2)} کیلوگرم وزن کم کنید.`);
        } else {
            bmiResultIndex.text("وزن شما در حد وزن ایده‌آل است.");
        }
    }

    function suggestDietPlan(bmi) {
        // پیشنهاد بر اساس شاخص توده بدنی (BMI)
        var dietSuggestion = $("#diet-suggestion");

        if (bmi < 18.5) {
            dietSuggestion.text("شما در وضعیت کمبود وزن هستید. برای بهبود وضعیت، می‌توانید یکی از رژیم‌های غذایی با افزایش کالری را امتحان کنید. مثلاً رژیم با مصرف مواد غذایی حاوی پروتئین بیشتر و کربوهیدرات سالم.");
        } else if (bmi >= 18.5 && bmi < 24.9) {
            dietSuggestion.text("وضعیت وزن شما به نظر می‌رسد عالی است. برای حفظ این وضعیت، ادامه یک رژیم غذایی سالم را پیشنهاد می‌شود. مثلاً رژیم متعادل با مصرف میوه‌ها، سبزیجات، پروتئین، و کربوهیدرات مناسب.");
        } else if (bmi >= 25 && bmi < 29.9) {
            dietSuggestion.text("شما اضافه وزن دارید. برای کاهش وزن، می‌توانید از رژیم‌های کم‌کالری یا با افزایش فعالیت ورزشی استفاده کنید. مثلاً رژیم با محدودیت کالری و افزایش مصرف میوه‌ها و سبزیجات.");
        } else {
            dietSuggestion.text("شما دارای چاقی هستید. برای بهبود وضعیت، مشاوره پزشکی و تغذیه‌ای را دریافت کنید. ممکن است نیاز به یک برنامه کاهش وزن تحت نظر پزشک یا تغذیه‌شناس داشته باشید.");
        }
    }
});