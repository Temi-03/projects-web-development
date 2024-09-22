const mysql = require('mysql');
const readline = require('readline');
//***************************************************************************************************** */
//       I USED NODE.JS AND XAAMP
//TO USE THE CRUD FUNCTION TAKE AWAY THE // FROM THE create(),retrive(),update(),delet()  ONE AT A TIME
//SO YOU ARE ABLE  TO ACCES YOU DESIRED FUNCTION THESE FUBCTIONS ARE LOCATED ON LINE 26-29 OF THE FILE  THANK YOU.
//***************************************************************8*****************************************/


const con = mysql.createConnection({
    host: "localhost",
    user: "nodeUser",
    password: "nodeUser",
    database: "user"
});

 //Connect to database
con.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    
    console.log('Connected to MySQL database with connection id ' + con.threadId);
    
 
});
    // create() ;
    // retrieve(); // Call the retrieve function after database connection is established
    // update();
    // Delete();

const rl = readline.createInterface({//so imput can be taken 
    input: process.stdin,
    output: process.stdout
});

console.log("Welcome to your database. Enter:");

function create() { //
    let userData = {
        Title: '',
        FirstNames: '',
        Surname: '',
        Mobile: '',
        EmailAddress: '',
        HomeAddress: {
            AddressLine1: '',
            AddressLine2: '',
            Town: '',
            CountyOrCity: '',
            Eircode: ''
        }
   };

    rl.question("Title: ", (title) => {  //ask question and stores answer 
        userData.Title = title;
        rl.question("First Name: ", (firstName) => {
            userData.FirstNames = firstName;
            rl.question("Surname: ", (surname) => {
                userData.Surname = surname;
                rl.question("Mobile: ", (mobile) => {
                    userData.Mobile = mobile;
                    rl.question("Email Address: ", (email) => {
                        userData.EmailAddress = email;
                        rl.question("Home Address Line 1: ", (addressLine1) => {
                            userData.HomeAddress.AddressLine1 = addressLine1;
                            rl.question("Home Address Line 2: ", (addressLine2) => {
                                userData.HomeAddress.AddressLine2 = addressLine2;
                                rl.question("Home Town: ", (town) => {
                                    userData.HomeAddress.Town = town;
                                    rl.question("Home County/City: ", (countyCity) => {
                                        userData.HomeAddress.CountyOrCity = countyCity;
                                        rl.question("Home Eircode: ", (eircode) => {
                                            userData.HomeAddress.Eircode = eircode;
                                            insert(userData);
                                            rl.close();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
   });
}

function insert(userData) {
    con.beginTransaction(function(err) {
        if (err) throw err;

        con.query('INSERT INTO users (Title, FirstNames, Surname, Mobile, EmailAddress) VALUES (?, ?, ?, ?, ?)', [userData.Title, userData.FirstNames, userData.Surname, userData.Mobile, userData.EmailAddress], function(err, result) {
            if (err) {//proforming sql statements 
                     throw err;
               
               
            }
            
            const userID = result.insertId;

            con.query('INSERT INTO useraddress (userID, addressLine1, addressLine2, Town, countyOrCity, Eircode) VALUES (?, ?, ?, ?, ?, ?)', [userID, userData.HomeAddress.AddressLine1, userData.HomeAddress.AddressLine2, userData.HomeAddress.Town, userData.HomeAddress.CountyOrCity, userData.HomeAddress.Eircode], function(err, result) {
                if (err) {
                    return con.rollback(function() {
                        throw err;
                    });
                }

                con.commit(function(err) {
                    if (err) {
                        return con.rollback(function() {
                            throw err;
                        });
                    }
                    console.log('Data inserted successfully');
                });
            });
        });
    });
}



const userfindArray = []; //to stor the input in 
function retrieve() {
    console.log("Enter the user name (FIRST NAME ONLY):");
    rl.once('line', (input) => {
        userfindArray.push(input); // Push the input into the array
        rl.close();
        find(); // Call finddata after user input
    });

    rl.on('close', () => {
        console.log('Readline interface closed.');
    });
}

function find() {
    const name = userfindArray[0]; 
    
    console.log('Searching for user with name:', name); 
    
    const sql = `
        SELECT users.*, useraddress.*
        FROM users
        LEFT JOIN useraddress ON users.UserID = useraddress.UserID
        WHERE users.FirstNames = ?
    `;

    con.query(sql, [name], function(err, result) {
        if (err) {
            console.error('Error executing database query:', err);
            return;
        }

        console.log('Data retrieved from the database:', result);
    });
}

// to get the id so can connect batabases 
function getId(firstName, lastName, callback) {
    const sql = `
        SELECT UserID
        FROM users
        WHERE FirstNames = ? AND Surname = ?
    `;
    con.query(sql, [firstName, lastName], function(err, result) {
        if (err) {
            console.error('Error retrieving user ID:', err);
            callback(null); 
        }
        if (result.length === 0) {
            console.error('User not found');
            callback(null); 
            return;
        }
        callback(result[0].UserID); // Pass the retrieved user ID
    });
}

//  update user details in the database based on user input

function update() {
    

    let userData = {
        Title: '',
        FirstNames: '',
        Surname: '',
        Mobile: '',
        EmailAddress: '',
        HomeAddress: {
            AddressLine1: '',
            AddressLine2: '',
            Town: '',
            CountyOrCity: '',
            Eircode: ''
        }
    };

    console.log("Enter the user's first name:");
    rl.question("First Name: ", (firstName) => {
        userData.FirstNames = firstName;

        console.log("Enter the user's last name:");
        rl.question("Last Name: ", (lastName) => {
            userData.Surname = lastName;

            console.log("Enter the new Mobile number:");
            rl.question("Mobile: ", (phone) => {
                userData.Mobile = phone;

                console.log("Enter the new email address:");
                rl.question("Email: ", (email) => {
                    userData.EmailAddress = email;

                    console.log("Enter the new title:");
                    rl.question("Title: ", (title) => {
                        userData.Title = title;

                        console.log("Enter the new address details (press enter to skip):");
                       
                        rl.question("Address Line 1: ", (addressLine1) => {
                            userData.HomeAddress.AddressLine1 = addressLine1;

                            
                            rl.question("Address Line 2: ", (addressLine2) => {
                                userData.HomeAddress.AddressLine2 = addressLine2;

                               
                                rl.question("Town: ", (town) => {
                                    userData.HomeAddress.Town = town;

                                  
                                    rl.question("County/City: ", (countyCity) => {
                                        userData.HomeAddress.CountyOrCity = countyCity;

                                        
                                        rl.question("Eircode: ", (eircode) => {
                                            userData.HomeAddress.Eircode = eircode;

                                            // Call the function to update user details in the database
                                            updateDatabase(userData);
                                            rl.close();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}




// Function to update user details in the database
function updateDatabase(userData) {
    getId(userData.FirstNames, userData.Surname, function(userID) {
        if (!userID) {
            console.error('User not found. Cannot update details.');
            return;
        }

        const updateUserSql = `
            UPDATE users
            SET Mobile = ?, EmailAddress = ?, Title = ?
            WHERE UserID = ?
        `;
        const updateUserParams = [userData.Mobile, userData.EmailAddress, userData.Title, userID];

        con.query(updateUserSql, updateUserParams, function(err, result) {
            if (err) {
                console.error('Error updating user:', err);
                return;
            }

            const updateAddressSql = `
                UPDATE useraddress
                SET AddressLine1 = ?, AddressLine2 = ?, Town = ?, CountyOrCity = ?, Eircode = ?
                WHERE UserID = ?
            `;
            const updateAddressParams = [userData.HomeAddress.AddressLine1, userData.HomeAddress.AddressLine2, userData.HomeAddress.Town, userData.HomeAddress.CountyOrCity, userData.HomeAddress.Eircode, userID];
            
            con.query(updateAddressSql, updateAddressParams, function(err, result) {
                if (err) {
                    console.error('Error updating user address:', err);
                    return;
                }
                console.log('User and address updated successfully');
            });
        });
    });
}
function Delete() {
    

    let userData = {
        FirstNames: '',
        Surname: '',
        EmailAddress: '',
        Phone: ''
    };

    console.log("Enter user details to delete records:");

    rl.question("First Name: ", (firstName) => {
        userData.FirstNames = firstName;

        rl.question("Last Name: ", (lastName) => {
            userData.Surname = lastName;

            rl.question("Email Address: ", (email) => {
                userData.EmailAddress = email;

                rl.question("Mobile: ", (phone) => {
                    userData.Mobile = phone;

                    // Call the function to delete records
                    deletedata(userData);
                    rl.close();
                });
            });
        });
    });
}

function deletedata(userData) {
    // First, delete records from the useraddress table
    const deleteAddressSql = `
        DELETE FROM useraddress
        WHERE UserID IN (
            SELECT UserID FROM users
            WHERE FirstNames = ? AND Surname = ? AND EmailAddress = ? AND Mobile = ?
        )
    `;

    con.query(deleteAddressSql, [userData.FirstNames, userData.Surname, userData.EmailAddress, userData.Mobile], function(err, result) {
        if (err) {
            console.error('Error deleting records from useraddress:', err);
            return;
        }

        // After deleting records from useraddress, proceed to delete records from users table
        const deleteSql = `
            DELETE FROM users
            WHERE FirstNames = ? AND Surname = ? AND EmailAddress = ? AND Mobile = ?
        `;

        con.query(deleteSql, [userData.FirstNames, userData.Surname, userData.EmailAddress, userData.Mobile], function(err, result) {
            if (err) {
                console.error('Error deleting records from users:', err);
                return;
            }
            console.log('Records deleted successfully');
        });
    });
}

