(function($) {
    "use strict";

    var Hotels = (function() {

        var _endpoint = 'http://fake-hotel-api.herokuapp.com/api/';

        var _getHotelsList =  function() {

            return $.ajax({
                url: _endpoint + 'hotels',
                dataType: "jsonp",
                cache: false
            });

        };

        var _getHotelReviews = function(hotelId) {

            return $.ajax({
                url: _endpoint + 'reviews',
                dataType: "jsonp",
                cache: false,
                data: {hotel_id: hotelId}
            });

        };

        return {
            getHotelsList: _getHotelsList,
            getHotelReviews: _getHotelReviews
        };

    })();

    var Render = (function() {

        var _hotelsToRender = 5;

        var _purify = function(str){
            return $("<div/>").html(str).text();
        };

        var _capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        var _formatGeoLocation = function(city, country) {
            return _capitalize(city) + " - " + _capitalize(country);
        };

        var _formatDate = function(start, end) {
            var startDate = new Date(start),
                endDate = new Date(end);

            return startDate.getDate() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getFullYear() + " - " + 
                    endDate.getDate() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getFullYear();
        };

        var _hotelIterator = function($item, obj) {
            var image = obj.images[0] || '',
                name = obj.name || '',
                city = obj.city || '',
                country = obj.country || '',
                desc = obj.description || '',
                price = obj.price || '',
                start = obj.date_start || '',
                end = obj.date_end || '',
                id = obj.id || 0,
                stars = obj.stars || 0;

            $item.find('img').prop('src', _purify(image));
            $item.find('.single-content__name').find('h1').text(_capitalize(name));
            $item.find('.single-content__name').find('span').text(_formatGeoLocation(city, country));
            $item.find('article').text(desc);
            $item.find('.price').find('span').text(price);
            $item.find('.date').text(_formatDate(start, end));
            $item.find('.show-reviews').attr('data-hotel', id);

            $item.find(".single-content__stars").rateYo({
                rating: stars,
                starWidth: "25px"
            });

            $item.removeClass('hide');
        };

        var _reviewIterator = function($item, obj) {
            var name = obj.name || '',
                comment = obj.comment || '',
                positive = obj.positive || '';

            $item.find('.name').text(name);
            $item.find('.content').text(comment);

            if(positive)
            {
                $item.find('.plus').removeClass('hide');
            }
            else
            {
                $item.find('.minus').removeClass('hide');
            }

            $item.removeClass('hide');
        };

        var _renderHotelsList = function(response) {
            var $template = $('.single').last(),
                $holder = $('#hotels'),
                $currentItem, i = 0;

            $holder.html('');

            var inter = setInterval(function() {

                var currentObj = response[i];

                if(i == _hotelsToRender)
                {
                    return clearInterval(inter);
                }

                $template.clone().appendTo($holder);
                $currentItem = $holder.find('.single').eq(i);

                _hotelIterator($currentItem, currentObj);
                
                i++
            }, 300);
        };

        var _renderHotelReviews = function($context, response) {
            var $row = $context.closest('.row'),
                $template = $row.find('.single-review'),
                $holder = $row.find('.reviews'),
                len = response.length, 
                $currentItem, currentObj, i;

            $context.addClass('.visible');

            for(i = 0; i < len; i++)
            {
                currentObj = response[i];

                $template.clone().appendTo($holder);

                $currentItem = $holder.find('.single-review').eq(i);

                _reviewIterator($currentItem, currentObj);

                if(i == len - 1)
                {
                    $currentItem.find('hr').remove();
                }
            }

            $holder.slideToggle();
        };

        return {
            renderHotelsList: _renderHotelsList,
            renderHotelReviews: _renderHotelReviews
        };

    })();

    $(document).ready(function() {

        $('#load-hotels').on('click', function(e) {
            var $loader = $('.loader'),
                $error = $('#load-error');

            $loader.removeClass('hide');

            Hotels.getHotelsList()

            .done(function(response) {
                var res = response || {};
                $loader.addClass('hide');
                $error.is(':visible') ? $error.addClass('hide') : '';

                Render.renderHotelsList(res);
            })

            .fail(function(response) {
                $('#hotels').html('');
                $loader.addClass('hide');
                $error.removeClass('hide');
            }); 

        });

        $('#hotels').on('click', '.show-reviews', function(e) {
            var $this = $(this),
                hotelId = $this.data('hotel') || '',
                $reviews = $this.closest('.row').find('.reviews');

            if($reviews.contents().length)
            {
                $reviews.slideToggle();
            }
            else
            {
                Hotels.getHotelReviews(hotelId)

                .done(function(response) {
                    var res = response || {};

                    if(res.length)
                    {
                        Render.renderHotelReviews($this, res);
                    }
                })

                .fail(function(response) {
                    
                });
            }

            if($this.text() == 'Show reviews')
            {
                $this.text('Hide reviews');
            }
            else
            {
                $this.text('Show reviews');
            }
        });

    });

})(jQuery);