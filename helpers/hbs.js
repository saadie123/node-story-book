const moment = require('moment');
module.exports = {
    truncate: (str, len) => {
        if (str.length > len && str.length > 0) {
            let new_str = str + ' ';
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(' '));
            new_str = (new_str.length > 0) ? new_str : str.substr(0,len);
            return new_str + '...';
        }
        return str;
    },
    stripTags: (input) => {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: (date, format) => {
        return moment(date).format(format);
    },
    select: ( selected, options ) => {
        return options.fn(this).replace(
            new RegExp(' value=\"' + selected + '\"'),
            '$& selected="selected"');
    },
    editIcon: (storyUser, loggedInUser, storyId, floating = true) => {
        if(storyUser == loggedInUser){
            if(floating){
                return `<a href='/stories/edit/${storyId}' class='btn-floating halfway-fab red'>
                <i class='fa fa-pencil'></i>
                </a>`;
            } else{
                return `<a href='/stories/edit/${storyId}'>
                <i class='fa fa-pencil'></i>
                </a>`;
            }
        } else {
            return '';
        }
    }
}