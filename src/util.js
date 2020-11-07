import moment from 'moment';


export function isSameDate(date1, date2) {
    return (date1.getDay() === date2.getDay()) &&
           (date1.getMonth() === date2.getMonth()) && 
           (date1.getFullYear() === date2.getFullYear());
    
}

export function formatTime(chatTime, fullDate = false) {
    const chatDate = new Date(chatTime);   
    //const chatDate = new Date(2019, 9, 1);     
    const today = new Date();
    const time = moment(chatDate);

    if (chatDate.getDay() === today.getDay()) {
        if (fullDate === true) {
            return 'Today ' + time.format('hh:mm a');
        }
        return time.format('hh:mm a');
        
    } 

    const timeDifference = (Date.now() - chatDate.getTime()) / ( 24 * 60 * 60 * 1000);

    if (timeDifference < 7) {
        return time.format('dddd hh:mm a');
    }

    if (chatDate.getFullYear() === today.getFullYear()) {
        return time.format('MMM D hh:mm a');
    }
    return time.format('MMM D YYYY');
}

export function lastActive(userStatus, user) {
    //console.log(props.userStatus);
    const curUserStatus = userStatus.filter((status) => status.userEmail === user.email);
    const lastSeen = curUserStatus[0].lastSeen;
    const lastSeenFromNow = moment(lastSeen).fromNow();
    return 'Active ' + (lastSeenFromNow === 'a few seconds ago' ? 'now' : lastSeenFromNow);
}