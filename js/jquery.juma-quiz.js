/*global document, jQuery, window*/

/*!
 * jQuery Personality Quiz Plugin
 * Original author: @justmarkup
 * Licensed under the MIT license
 */


(function ($, window, document) {
    "use strict";
    var pluginName = 'jumaQuiz',
        defaults = {
            container: 'juma-quiz',
            progress: true
        },
        ques,
        forward,
        answers,
        cur_ques,
        tmp_points = [],
        points = 0,
        score,
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

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            con = '#' + this.options.container;
            ques = con + ' > li';
            if (this.options.progress) {
                this.addProgress();
            }
            this.setActive(ques);
            this.answer(con);
        },
        addProgress: function () {
            $(con).before('<div class="juma-progress"><span></span></div>');
            con_w = $(con).outerWidth();
            progress = '.juma-progress';
            progress_bar = $(progress + '> span');
            $(progress).css('width', con_w);
        },
        setActive: function (ques) {
            $('html').addClass('js');
            $(con).after('<button class="juma-forward">Next</button>');
            forward = $('.juma-forward');
            forward.attr("disabled", "disabled");
            if (!$(ques).hasClass('active')) {
                $(ques + ':first-child').addClass('active');
            }
        },
        answer: function (con) {
            answers = $(ques + '> ul li');
            forward = $('.juma-forward');
            answers.click(function () {
                answers.removeClass('juma-choice');
                forward.attr("disabled", "disabled");
                cur_ques = $(ques + '.active').data('question');
                forward.removeAttr("disabled");
                $(this).addClass('juma-choice');
            });

            forward.click(function () {
                tmp_points[cur_ques] = $('.juma-choice').data('points');
                points += tmp_points[cur_ques];
                cur_ques = $(ques + '.active');
                if (cur_ques.is(':last-child')) {
                    $('.juma-progress > span').css('width', con_w);
                    $(con).hide();
                    forward.hide();
                    score_child = $('.juma-score li').length;
                    for (score_i; score_i < score_child; score_i += 1) {
                        var a = $('.juma-score li')[score_i];
                        if (points <= $(a).data('points')) {
                            $(a).show();
                            return;
                        }
                    }
                } else {
                    $(ques).removeClass('active');
                    (cur_ques).next('li').addClass('active');
                    forward.attr("disabled", "disabled");
                    progress_bar.css('width', con_w / $(ques).length);
                    progress_w = parseInt(progress_bar.css('width'), 10);
                    $('.juma-progress > span').css('width', progress_w * ($('.active').data('question') - 1) + 'px');
                }
            });
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

}(jQuery, window, document));