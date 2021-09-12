const apiFeatures = (queryObj, model) => {
    let queryStr = {
        ...queryObj
    };
    const excludeFields = ['page', 'sort', 'limit', 'field'];
    excludeFields.forEach(el => delete queryStr[el]);

    queryStr = JSON.parse(JSON.stringify(queryStr).replace(/\b(lte|lt|gte|gt)\b/g, match => `$${match}`));

    let query = model.find(queryStr);

    if (queryObj.sort) {
        const sortObj = JSON.parse(JSON.stringify(queryObj.sort).replace(',', ' '));
        query = query.sort(sortObj);
    }
    return query;
}

// class apiFeatures {
//     constructor(queryObj, model) {
//         this.queryObj = queryObj;
//         this.queryStr = {
//             ...queryObj
//         };
//         this.model = model;
//     };

//     filter() {
//         const excludeFields = ['page', 'sort', 'limit', 'field'];
//         excludeFields.forEach(el => delete this.queryStr[el]);

//         this.query = this.model.find(this.queryStr);

//         return this;
//     }

//     sort() {
//         if (this.queryObj.sort) {
//             const sortObj = JSON.parse(JSON.stringify(this.queryObj.sort).replace(',', ' '));
//             this.query = this.query.sort(sortObj);
//         }

//         return this;
//     }
// }

module.exports = apiFeatures;