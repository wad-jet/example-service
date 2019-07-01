function setNearestUser(user) {
    if (!user) {
        $('#nearest-user-profile').hide();
        return;
    }

    $('#nearest-user-name').text(user.profile.userName);
    $('#nearest-user-email').text(user.email);
    $('#nearest-user-level').text(user.level);
    $('#nearest-user-rating').text(user.rating);

    $('#nearest-user-profile').show();
}

function setAmount(result) {
    if (result.level !== undefined) {
        $('#level-value').text(result.level);
    }
    if (result.rating !== undefined) {
        $('#rating-value').text(result.rating);
    }
    if ($('#auto-find-nearest:checked').length === 1) {
        findNearestUser(+$('#rating-value').text(), +$('#level-value').text());
    } else {
        setNearestUser(null);
    }
}

function levelIncrement(userId) { 
    $.ajax({ url: '/users/levelIncrement/' + userId }).done(setAmount);
}

function levelDecrement(userId) { 
    $.ajax({ url: '/users/levelDecrement/' + userId }).done(setAmount);
}

function ratingIncrement(userId) { 
    $.ajax({ url: '/users/ratingIncrement/' + userId }).done(setAmount);
}

function ratingDecrement(userId) {
    $.ajax({ url: '/users/ratingDecrement/' + userId }).done(setAmount);
}

function findNearestUser(rating, level) {
    $.ajax({ url: '/users/findNearestUser/' + rating + '/' + level }).done(setNearestUser);
}