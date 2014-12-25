/*global jQuery*/

/*!
 * jQuery Personality Quiz Plugin
 * Original author: Michael Scharnagl @justmarkup
 * Version 0.2.0
 * Licensed under the MIT license
 */


(function ($) {
    "use strict";
    var pluginName = 'jumaQuiz',
        option,
        defaults = {
            container: 'juma-quiz',
            progress: true,
            nextAuto: false,
            showFinalScore: false
        },
        ques,
        forward,
        answers,
        cur_ques,
        tmp_points = [],
        points = 0,
        score_child,
        score_i = 0,
        progress,
        progress_w,
        progress_bar,
        con,
        con_w;

    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        option = this.options;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    function addProgress () {
        $(con).before('<div class="juma-progress"><span></span></div>');
        con_w = $(con).outerWidth();
        progress = '.juma-progress';
        progress_bar = $(progress + '> span');
        $(progress).css('width', con_w);
    }

    function setActive (ques) {
        if (!option.nextAuto) {
            $(con).after('<button type="submit" title="Show next question" class="juma-forward">Next</button>');
        }
        
        forward = $('.juma-forward');
        forward.attr("disabled", "disabled");
        if (!$(ques).hasClass('active')) {
            $(ques + ':first-child').addClass('active');
        }
    }

    function answer () {
        answers = $(ques + '> ul li');
        answers.on('click keydown', function (ev) {
            if (ev.which == 1 || ev.which == 13) {
                answers.removeClass('juma-choice');
                answers.attr('aria-checked', false);
                forward.attr("disabled", "disabled");
                cur_ques = $(ques).index($( ".active" )) + 1;
                forward.removeAttr("disabled");
                $(this).addClass('juma-choice');
                $(this).attr('aria-checked', true);
                if (option.nextAuto) {
                    nextQuestion();
                }
            } else {
                
            }

        });
        if (!option.nextAuto) {
            forward.click(function () {
                nextQuestion();
            });
        }
    }

    function nextQuestion () {
        tmp_points[cur_ques] = $('.juma-choice').data('points');
        points += tmp_points[cur_ques];
        cur_ques = $(ques + '.active');
        if (cur_ques.is(':last-child')) {
            $(progress + ' > span').css('width', con_w);
            $(con).hide();
            forward.hide();
            score_child = $('.juma-score li').length;
            for (score_i; score_i < score_child; score_i += 1) {
                var a = $('.juma-score li')[score_i];
                if (points <= $(a).data('points')) {
                    $(a).show();
                    if (option.showFinalScore) {
                       $('.juma-final-score').text(points); 
                    }
                    return;
                }
            }
        } else {
            $(ques).removeClass('active');
            (cur_ques).next('li').addClass('active');
            forward.attr("disabled", "disabled");
            if (option.progress) {
                progress_bar.css('width', con_w / $(ques).length);
                progress_w = parseInt(progress_bar.css('width'), 10);
                $(progress + ' > span').css('width', progress_w * ($(ques).index($( ".active" ))) + 'px');
            }
        }
    }

    Plugin.prototype = {
        init: function () {
            con = '#' + option.container;
            ques = con + ' > li';
            if (option.progress) {
                addProgress();
            }
            setActive(ques);
            answer();
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

}(jQuery));