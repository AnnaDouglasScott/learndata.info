var dateFormat = function () {
    // Regexes and supporting functions are cached through closure
    return 
}();

// For convenience...
Date.prototype.format = function (mask) {
    var date = this,
        token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        },
        names = {
            day: [
                "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ],
            month: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ]
        },
        masks = { // Some common format strings
            "default":      "ddd mmm dd yyyy HH:MM:ss",
            shortDate:      "m/d/yy",
            mediumDate:     "mmm d, yyyy",
            longDate:       "mmmm d, yyyy",
            fullDate:       "dddd, mmmm d, yyyy",
            shortTime:      "h:MM TT",
            mediumTime:     "h:MM:ss TT",
            longTime:       "h:MM:ss TT Z",
            isoDate:        "yyyy-mm-dd",
            isoTime:        "HH:MM:ss",
            isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss"
        };
    
    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
        mask = date;
        date = undefined;
    }
    
    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");
    
    mask = String(masks[mask] || mask || masks["default"]);
    
    var d = date.getDate(),
        D = date.getDay(),
        m = date.getMonth(),
        y = date.getFullYear(),
        H = date.getHours(),
        M = date.getMinutes(),
        s = date.getSeconds(),
        L = date.getMilliseconds(),
        o = date.getTimezoneOffset(),
        flags = {
            d:    d,
            dd:   pad(d),
            ddd:  names.day[D],
            dddd: names.day[D + 7],
            m:    m + 1,
            mm:   pad(m + 1),
            mmm:  names.month[m],
            mmmm: names.month[m + 12],
            yy:   String(y).slice(2),
            yyyy: y,
            h:    H % 12 || 12,
            hh:   pad(H % 12 || 12),
            H:    H,
            HH:   pad(H),
            M:    M,
            MM:   pad(M),
            s:    s,
            ss:   pad(s),
            l:    pad(L, 3),
            L:    pad(L > 99 ? Math.round(L / 10) : L),
            t:    H < 12 ? "a"  : "p",
            tt:   H < 12 ? "am" : "pm",
            T:    H < 12 ? "A"  : "P",
            TT:   H < 12 ? "AM" : "PM",
            Z:   (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };
    
    return mask.replace(token, function ($0) {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
};

function getNews() {
        console.log("In News");
        $.getJSON( "http://contentapi.theodi.org/with_tag.json?article=news", function( data ) {
             news = data.results;
             news.sort(function(a,b) {
                return new Date(b.created_at) - new Date(a.created_at);
             });
             console.log(news);
        })
        .error(function() {
            console.log("error");
        });
}

function getEvents(location,amount) {
        console.log("In News");
        $.getJSON( "https://odi-courses-data.herokuapp.com/getEvents.php", function( data ) {
             news = data.results;
             news.sort(function(a,b) {
                return new Date(a.details.start_date) - new Date(b.details.start_date);
             });
             for(i=0;i<=amount;i++) {
                renderItem(news[i],location);
                renderFooter(news[i],"events_footer");
             }
        })
        .error(function() {
            console.log("error");
        });
}

function renderFooter(item,location) {
    if (item.details.event_type == "event:lunchtime-lecture") {
        desc = item.details.description;
        image = desc;
        image = image.substring(image.indexOf('src="')+5,image.length);
        image = image.substring(0,image.indexOf('"'));
        url = item.details.booking_url;
    }
    html = '<div class="event_single_post">';
    html += '<img src="'+image+'" alt="">';
    html += '<a href="'+url+'">';
    html += '<p>'+item.title+'</p>';
    html += '</a>';
    html += '</div>';
    $("#" + location).append(html);
}

function renderItem(item,location) {
    datetime = new Date(item.details.start_date);
    if (item.details.event_type == "event:lunchtime-lecture") {
        desc = item.details.description;
        image = desc;
        image = image.substring(image.indexOf('src="')+5,image.length);
        image = image.substring(0,image.indexOf('"'));
        desc = desc.split('<p>')[4];
        desc = desc.split('</p>')[0];
        price = "Free";
        url = item.details.booking_url;
    }
    html = '<div class="col-md-4 col-xs-12">';
         html += '<div class="single_courses">';
            html += '<div class="single_courses_thumb">';
                html += '<img src="'+image+'" alt="" style="height: 200px;">';
                html += '<div class="hover_overlay">';
                    html += '<div class="links">';
                        html += '<a class="magnific-popup" href="'+image+'"><i class="fa fa-search" aria-hidden="true"></i></a>';
                    html += '</div>';
                html += '</div>';
            html += '</div>';
            html += '<div class="single_courses_desc">';
                html += '<div class="title">';
                    html += '<a href="#"><h5>' + item.title + '</h5></a>';
                    html += '<div class="date_time">';
                        html += '<div class="date">';
                            html += '<p><span class="icon-calendar"></span>&nbsp;'+datetime.format('dS mmmm yyyy')+'</p>';
                        html += '</div>';
                        html += '<div class="time">';
                            html += '<p><span class="icon-clock"></span>&nbsp;'+datetime.format('HH:MM')+'</p>';
                        html += '</div>';
                    html += '</div>';
                    html += '<p>'+desc+'</p>';
                html += '</div>';
                html += '<div class="price_rating_area">';
                    html += '<div class="price">';
                        html += '<span>£'+price+'</span>';
                    html += '</div>';
                    html += '<div class="seat">';
                        html += '<a href="'+url+'" class="courseButton bookButton btn btn-primary" style="border: 1px solid #333; position: relative; bottom: 10px;">Book</a>';
                        //html += '<i class="fa fa-users" aria-hidden="true"><span>50</span></i>';
                    html += '</div>';
                html += '</div>';
            html += '</div>';
        html += '</div>';
    html += '</div>';
    $("#" + location).append(html);
}

$( document ).ready(function() {
    getNews();
});

$( document ).ready(function() {
    getEvents("events_home",3);
});