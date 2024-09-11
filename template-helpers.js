export function formatDate(dateStr) {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const [day, month, year] = dateStr.split("/").map(Number);

    const monthName = months[month - 1];
    const dayWithSuffix = getDaySuffix(day);

    return `${monthName} ${dayWithSuffix}, ${year}`;
}

function getDaySuffix(day) {
    if (day > 3 && day < 21) return day + "th";
    switch (day % 10) {
        case 1: return day + "st";
        case 2: return day + "nd";
        case 3: return day + "rd";
        default: return day + "th";
    }
}