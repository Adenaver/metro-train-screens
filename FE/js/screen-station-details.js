(function() {
    "use strict";

    var HIDE_PREVIOUS_STATION_DURATION = 500; // Check b-station-details.less before update!
    var NEXT_STATION = {
        ua: 'Наступна станція',
        en: 'Next station'
    };
    var CURRENT_STATION = {
        ua: 'Станція',
        en: 'This station is'
    };
    var TRANSFER_TO_TRAM = {
        ua: 'Пересадка на швидкісний трамвай',
        en: 'Transfer to Express Tram'
    };
    var TRANSFER_TO_METRO = {
        ua: 'Перехід на станцію',
        en: 'Transfer to'
    };
    var TRANSFER_TO_URBAN_RAIL = {
        ua: 'Вихід до міської електрички',
        en: 'Transfer to City Train'
    };

    var $window, $body, $header, $stationDetails, $stationsList, stationDetailTmpl;

    if (!window.app) {
        window.app = {};
    }

    if (!app.screens) {
        app.screens = {};
    }

    jQuery(function($) {
        $window = $(window);
        $body = $('body');
        $header = $('.b-header');
        $stationDetails = $('.b-station-details');
        $stationsList = $('.b-stations-list');
        stationDetailTmpl = doT.template($('#tmpl-station-details').html());

        app.screens.StationDetails = Screen;
    });

    function Screen(station, isNext) {
        var lang, $stationTitle, $stationName1, $stationName2, $transferTitle, $transferStation,
            that = this,
            intervals = [],
            timeouts = [];

        this.name = 'station-details';
        this.stop = stop;
        cleanAndInit();

        function cleanAndInit() {
            var $detailsHeader, $detailsFooter, windowHeight,
                previousScreen = app.screens.current;

            if (previousScreen) {
                previousScreen.stop();
            }

            app.screens.current = that;
            $body.addClass('b-screen_station-details');

            if (previousScreen && previousScreen.name !== that.name) {
                $stationsList.hide();
                $stationDetails.show();
                $header.empty();
            }

            // Screen change animation
            if (previousScreen && previousScreen.name === that.name) {
                $detailsHeader = $('.b-station-details__header');
                $detailsFooter = $('.b-station-details__footer');
                windowHeight = $window.height();

                $detailsHeader
                    .addClass('animate')
                    .css('top', windowHeight);

                $detailsFooter
                    .addClass('animate')
                    .css('bottom', -1 * (windowHeight - $detailsFooter.height()));

                addTimeout(function () {
                    $detailsHeader
                        .css('top', '')
                        .removeClass('animate');

                    $detailsHeader
                        .css('bottom', '')
                        .removeClass('animate');

                    init(station);
                }, HIDE_PREVIOUS_STATION_DURATION);

            } else {
                init(station);
            }
        }

        function init(station) {
            var $line;

            $stationDetails.html(stationDetailTmpl(station));
            $stationTitle = $stationDetails.find('.b-station-details__station-title');
            $stationName1 = $stationDetails.find('.b-station-details__station-name-1');
            $stationName2 = $stationDetails.find('.b-station-details__station-name-2');
            $line = $stationDetails.find('.b-station-details__line');
            $transferTitle = $stationDetails.find('.b-station-details__transfer-title');
            $transferStation = $stationDetails.find('.b-station-details__transfer-station');

            updateTexts();
            addInterval(updateTexts, 5000);

            $line.css('opacity', '0.5');

            addTimeout(function () {
                $line
                    .addClass('animate')
                    .css('opacity', '');
            }, 1);

            $line.find('div').scrollText(station.line);
        }

        function updateTexts() {
            var title, line1, line2, transferTitleText, transferStationText,
                transfer = station.transfer || {};

            lang = (lang === 'ua' ? 'en' : 'ua');

            if (isNext) {
                title = NEXT_STATION[lang];
            } else {
                title = CURRENT_STATION[lang];
            }

            line1 = station.name[lang].split(' ')[0];
            line2 = station.name[lang].split(' ')[1];

            $stationTitle.scrollText(title);
            $stationName1.scrollText(line1);

            if (line2) {
                $stationName2.scrollText(line2);
            }

            switch (true) {
                case !!transfer.trainStation:
                    transferTitleText = transfer.title[lang];
                    transferStationText = transfer.station[lang];
                    break;

                case !!transfer.trams:
                    transferTitleText = TRANSFER_TO_TRAM[lang];
                    transferStationText = transfer.station[lang];
                    break;

                case !!transfer.urbanRail:
                    transferTitleText = TRANSFER_TO_URBAN_RAIL[lang];
                    transferStationText = transfer.station[lang];
                    break;

                case !!transfer.metro:
                    transferTitleText = TRANSFER_TO_METRO[lang];
                    transferStationText = transfer.station[lang];
                    break;
            }

            if (transferTitleText && transferStationText) {
                $transferTitle.scrollText(transferTitleText);
                $transferStation.scrollText(transferStationText);
            }
        }

        function stop() {
            intervals.forEach(clearInterval);
            timeouts.forEach(clearTimeout);

            intervals = [];
            timeouts = [];

            $body.removeClass('b-screen_station-details');
        }

        function addTimeout(f, t) {
            timeouts.push(setTimeout(f, t));
        }

        function addInterval(f, t) {
            intervals.push(setInterval(f, t));
        }
    }
}());