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

function levelIncrement() { 
    $.ajax({ url: '/users/levelIncrement' }).done(setAmount);
}

function levelDecrement() { 
    $.ajax({ url: '/users/levelDecrement' }).done(setAmount);
}

function ratingIncrement() { 
    $.ajax({ url: '/users/ratingIncrement' }).done(setAmount);
}

function ratingDecrement() {
    $.ajax({ url: '/users/ratingDecrement' }).done(setAmount);
}

function findNearestUser(rating, level) {
    $.ajax({ url: '/users/findNearestUser/' + rating + '/' + level }).done(setNearestUser);
}