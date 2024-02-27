
const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
};

  
export { formatDate };