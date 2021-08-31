var connectionMongo = require('../connectors/mongo-conn');

async function insertData(coll, query) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.insertOne(query);
    await connection.close();
    return res;
}

async function getData(coll, query) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }
    const db = connection.db("ktp");
    let collection = db.collection(coll);

        let res = await collection.find(query).toArray();
        await connection.close();
        return res;

  
}

async function countData(coll, query) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.find(query).count();
    await connection.close();
    return res;
}


async function fastCountData(coll, query) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.countDocuments(query);
    await connection.close();
    return res;
}


async function updateData(coll, query, newQuery) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);

    let res = await collection.updateOne(query, newQuery);


    await connection.close();
    return res;
}

async function updateDataMany(coll, query, newQuery) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);

    let res = await collection.updateMany(query, newQuery);


    await connection.close();
    return res;
}

async function deleteData(coll, query) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.deleteOne(query);
    await connection.close();
    return res;
}

async function getDataSort(coll, query, sort) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.find(query).sort(sort).toArray();
    await connection.close();
    return res;
}

async function getIntervalDataWithAggre(coll, match) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.aggregate([{
        "$match": match
    },
    {
        "$group": {
            "_id": {
                "$toDate": {
                    "$subtract": [
                        { "$toLong": "$timestamp_registration" },
                        { "$mod": [{ "$toLong": "$timestamp_registration" }, 1000 * 60 * 60] }
                    ]
                }
            },
            "doc_count": { "$sum": "$total_visitor" }
        }
    },
    { $sort: { _id: 1 } }
    ], { allowDiskUse: true }).toArray();
    await connection.close();
    return res;
}

async function getIntervalDateDataWithAggre(coll, match) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.aggregate([{
        "$match": match
    },
    {
        $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", timezone: 'Asia/Jakarta', date: ("$timestamp_registration") } },
            totalVisitor: {
                $sum: "$total_visitor"
            }
        }
    },
    { $sort: { _id: 1 } }
    ], { allowDiskUse: true }).toArray();
    await connection.close();
    return res;
}
async function getStatisticBylocation(coll, match) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.aggregate([{
        "$match": match
    },
    { $group: { "_id": "$location", "doc_count": { "$sum": "$total_visitor" } }, },
    { $sort: { "_id": 1 } }
    ], { allowDiskUse: true }).toArray();
    await connection.close();
    return res;
}

async function getDataSortAgre(coll, query, sort, skip, limit) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    if (limit != null && skip != null) {
        try {
            var res = await collection.find(query).skip(skip).limit(limit).sort(sort).toArray();
        } catch (error) {
            console.log(error)
        }


    } else if (limit == null && skip != null) {
        var res = await collection.find(query).skip(skip).sort(sort).toArray();
    } else if (limit != null && skip == null) {
        var res = await collection.find(query).limit(limit).sort(sort).toArray();
    } else {
        var res = await collection.find(query).sort(sort).toArray();
    }

    await connection.close();
    return res;
}


async function sumTotalVisitor(coll, match) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.aggregate([{
        "$match": match
    },
    {
        $group: {
            _id: null,
            "TotalVisitor": {
                $sum: "$total_visitor"
            }
        }
    }
    ], { allowDiskUse: true }).toArray();
    await connection.close();
    return res;
}

async function groupLoc(coll, match) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }

    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.aggregate([{
        "$match": match
    },
    {
        $group: {
            _id: "$location",
        }
    }
    ], { allowDiskUse: true }).toArray();
    await connection.close();
    return res;
}

async function topVisitor(coll, match,skip,limit,searchQuery) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }
    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.aggregate([
        {
            "$match": match
        },
        {
            $group: {
                _id: "$personal_data.email",
                "name": { "$first": "$personal_data.name" },
                "TotalVisitor": {
                    $sum: 1
                }
            }
        },
        {
            $match: searchQuery
        },
        { "$sort": { "TotalVisitor": -1 }},
        { "$skip" : skip },
        { "$limit" : limit }
    ], { allowDiskUse: true }).toArray();
    await connection.close();
    return res;
}

async function topVisitorWithoutLimit(coll, match,searchQuery) {
    var connection = await connectionMongo.connectionMongo();
    if (!connection) {
        return;
    }
    const db = connection.db("ktp");
    let collection = db.collection(coll);
    let res = await collection.aggregate([
        {
            "$match": match
        },
        {
            $group: {
                _id: "$personal_data.email",
                "name": { "$first": "$personal_data.name" },
                "TotalVisitor": {
                    $sum: 1
                }
            }
        },
        {
            $match: searchQuery
        },
        { "$sort": { "TotalVisitor": -1 }},
        {
            $count: "total_data"
        }
    ], { allowDiskUse: true }).toArray();
    await connection.close();
    return res;
}

module.exports.topVisitorWithoutLimit = topVisitorWithoutLimit;
module.exports.topVisitor = topVisitor;
module.exports.insertData = insertData;
module.exports.getData = getData;
module.exports.countData = countData;
module.exports.fastCountData = fastCountData;
module.exports.getDataSort = getDataSort;
module.exports.updateData = updateData;
module.exports.deleteData = deleteData;
module.exports.sumTotalVisitor = sumTotalVisitor;
module.exports.getIntervalDataWithAggre = getIntervalDataWithAggre;
module.exports.getIntervalDateDataWithAggre = getIntervalDateDataWithAggre;
module.exports.getStatisticBylocation = getStatisticBylocation;
module.exports.getDataSortAgre = getDataSortAgre;
module.exports.updateDataMany = updateDataMany;
module.exports.groupLoc = groupLoc;



