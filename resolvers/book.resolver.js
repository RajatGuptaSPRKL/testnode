const Book = require('../controllers/models/book');

module.exports = {
    Query: {
        getAllBooks: () => {
            return new Promise((resolve, reject) => {
                Book.find((err, result) => {
                    if (err) {
                        reject([]);
                    } else {
                        resolve(result);
                    }
                });
            });
        },
        findBook: ({title}) =>{
            console.log(title);
            return new Promise((resolve, reject)=>{
                Book.findOne({title: title}, (err, result)=>{
                    console.log(err)
                    console.log(result);
                    if(err) reject(err);
                    else resolve(result);
                });
            });
        }
    },
    Mutation: {
        addNewBook: async ({ title, author, pages, year, createdAt }) => {
            console.log(title, author)
            let bookInstance = new Book({ title, author, pages, year, createdAt });
            return new Promise((resolve, reject) => {
                bookInstance.save((err) => {
                    if (err) {
                        reject({
                            status: 400,
                            message: err+""
                        })
                    } else {
                        resolve({ status: 200, message: "New book added successfullysss" });
                    }
                });
            });
        }
    }
};