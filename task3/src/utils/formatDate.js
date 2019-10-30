// All dates should look the same.
// If different date format for different locations of the world was required, I'd use npm date-fns.

function formatDate(timestamp) {
    if (!timestamp || typeof timestamp !== 'number') return '';

    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 1 ---> 01
    const day = ('0' + date.getDate()).slice(-2); // 1 ---> 01
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dayPart = hours >= 12 ? 'PM' : 'AM';
    const dayPartHours = dayPart === 'PM' ? hours - 12 : hours;

    return `${year}-${month}-${day}, ${dayPartHours ||
        12}:${minutes} ${dayPart}`;
}

export default formatDate;
