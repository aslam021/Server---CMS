var count = 0;

let created = () => {
    count++;
    if (count>=18) {
        console.log('\nAll tables were succefully created\n');
    }
}

let errCreating = (err, t_name) => {
    console.log("\nError: " + err + "\ncreating table: " + t_name + "\n");
};

exports.createAllTables = () =>{
};