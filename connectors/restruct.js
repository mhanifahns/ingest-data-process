const moment = require('moment');
const dataFunc = require('./data-caliana');
var crypto = require('crypto');


async function restructUpdateForm(body) {
    var UpdateData = {
        $set: {
            "form_name": body.form_name,
            "input_by": body.input_by,
            "client_key": body.client_key,
            "new_form":true,
            "form":body.form 
        }
    }
    return UpdateData
}

async function restructVisitData(body, visitor_id, countData, required_checkin_checker) {
    var salt = 'DN4C4ll1ana'
    var unique_id = crypto.randomBytes(16).toString("hex")
    var visitor_key = crypto.pbkdf2Sync(unique_id + Date.now().toString() + body.client_key, salt, 1, 16, `sha512`).toString(`hex`);
    /* expect personal_data.email must not null */

    var is_risk = false
    for (const iterator of body.health) {
        if (iterator.answer != iterator.key) {
            is_risk = true
        }
    }
    var total_visitor = 1

    if (typeof body.purpose.group_visit != 'undefined') {
        total_visitor = parseInt(body.purpose.group_visit)
    }
    var queryForm = {
        email: body.personal_data.email,
        client_key: body.client_key,
        is_delete: 0
    }

    var getBlockVisitor = await dataFunc.getData('block_visitor', queryForm)
    if (getBlockVisitor.length == 0) {
        var is_block = false
        var reason = ""
        var date_blocked = ""
    } else {
        var is_block = true
        var reason = getBlockVisitor[0].reason_block
        var date_blocked = getBlockVisitor[0].date_block
    }

    var insertDataVisitor = {
        "is_new": true,
        "location_number": body.location_number,
        "personal_data": body.personal_data,
        "visitor_key": visitor_key,
        "purpose": body.purpose,
        "health": body.health,
        "status": 'registered',
        "client_key": body.client_key,
        "is_block": is_block,
        "reason_block": reason,
        "all_question":body,
        "timestamp_blocked": date_blocked,
        "location": body.location,
        "timestamp_registration": moment().toDate(),
        "total_visitor": total_visitor,
        "visitor_id": visitor_id,
        "is_risk": is_risk
    }
    if (required_checkin_checker == 1) {
        insertDataVisitor.visitor_code = countData
    } else {
        insertDataVisitor.visitor_code = ''
    }
    return insertDataVisitor
}


async function restructUpdateData(body) {
    /* expect personal_data.email must not null */

    var is_risk = false
    for (const iterator of body.health) {
        if (iterator.answer != iterator.key) {
            is_risk = true
        }
    }
    var total_visitor = 1
    if (typeof body.purpose.group_visit != 'undefined') {
        total_visitor = body.purpose.group_visit
    }

    var queryForm = {
        email: body.personal_data.email,
        client_key: body.client_key,
        is_delete: 0
    }

    var getBlockVisitor = await dataFunc.getData('block_visitor', queryForm)
    if (getBlockVisitor.length == 0) {
        var is_block = false
        var reason = ""
        var date_blocked = ""
    } else {
        var is_block = true
        var reason = getBlockVisitor[0].reason_block
        var date_blocked = getBlockVisitor[0].date_block
    }

    var updateDataVisitor = {
        "personal_data": body.personal_data,
        "purpose": body.purpose,
        "health": body.health,
        "client_key": body.client_key,
        "location": body.location,
        "updated_by": body.updated_by,
        "is_block": is_block,
        "reason_block": reason,
        "timestamp_blocked": date_blocked,
        "total_visitor": total_visitor,
        "timestamp_update_data": moment().toDate(),
        "is_risk": is_risk
    }
    return updateDataVisitor
}


async function restructVisitorData(body) {
    var salt = 'DN4C4ll1anaVisitor'
    console.log('ew')
    var unique_id = crypto.randomBytes(16).toString("hex")
    var visitor_key = crypto.pbkdf2Sync(unique_id + Date.now().toString() + body.client_key, salt, 1, 16, `sha512`).toString(`hex`);
    /* expect personal_data.email must not null */
    
    var queryForm = {
        'personal_data.email': body.personal_data.email,
        client_key: body.client_key,
        is_delete: { $ne: 1 }
    }
    var getVisitorData = await dataFunc.getData('visitor_data', queryForm)
    console.log('ew')
    if (getVisitorData.length == 0) {
        var is_input = true
        var visitor_id = ''
        var total_visit = 1
    } else {
        var is_input = true
        var visitor_id = ''
        for (const iterator of getVisitorData) {
            var total_visit = 1
            if (iterator.personal_data.name.toLowerCase() == body.personal_data.name.toLowerCase()) {
                var is_input = false
                visitor_id = iterator._id
                if (typeof iterator.total_visit == 'undefined') {
                    var total_visit_now = await dataFunc.fastCountData('visit_data', { visitor_id: iterator._id })
                    var total_visit = parseInt(total_visit_now) + 1
                } else {
                    var total_visit = parseInt(iterator.total_visit) + 1
                }
            }
        }
    }

    var queryForm = {
        email: body.personal_data.email,
        client_key: body.client_key,
        is_delete: 0
    }
    var getBlockVisitor = await dataFunc.getData('block_visitor', queryForm)
    if (getBlockVisitor.length == 0) {
        var is_block = false
        var reason = ""
        var date_blocked = ""
    } else {
        var is_block = true
        var reason = getBlockVisitor[0].reason_block
        var date_blocked = getBlockVisitor[0].date_block
    }

    var insertDataVisitor = {
        "personal_data": body.personal_data,
        "visitor_key": visitor_key,
        "client_key": body.client_key,
        "timestamp_registration": moment().toDate(),
        "is_block": is_block,
        "reason_block": reason,
        "timestamp_blocked": date_blocked,
        "is_input": is_input,
        "visitor_id": visitor_id,
        "total_visit": total_visit
    }
    return insertDataVisitor
}



async function sampleRestructVisitData(body, visitor_id) {
    var salt = 'DN4C4ll1ana'
    var unique_id = crypto.randomBytes(16).toString("hex")
    var visitor_key = crypto.pbkdf2Sync(unique_id + Date.now().toString() + body.client_key, salt, 1, 16, `sha512`).toString(`hex`);
    /* expect personal_data.email must not null */

    var is_risk = false
    for (const iterator of body.health) {
        if (iterator.answer != iterator.key) {
            is_risk = true
        }
    }
    var total_visitor = 1

    if (typeof body.purpose.group_visit != 'undefined') {
        total_visitor = body.purpose.group_visit
    }
    var queryForm = {
        email: body.personal_data.email,
        client_key: body.client_key,
        is_delete: 0
    }

    var getBlockVisitor = await dataFunc.getData('block_visitor', queryForm)

    if (getBlockVisitor.length == 0) {
        var is_block = false
        var reason = ""
        var date_blocked = ""
    } else {
        var is_block = true
        var reason = getBlockVisitor[0].reason_block
        var date_blocked = getBlockVisitor[0].date_block
    }


    var days = Math.floor((Math.random() * 10) + 1);
    var time = Math.floor((Math.random() * 10) + 1);
    var rand = Math.floor((Math.random() * 5) + 1);
    var randtime = Math.floor((Math.random() * 5) + 1);
    if (rand == 1) {
        var timestamp_registration = moment().toDate()
        if (randtime != 2) {
            timestamp_registration = moment(timestamp_registration).subtract(time, 'hour').toDate()
        }

    } else {
        var timestamp_registration = moment().subtract(days, 'days').toDate()
        if (randtime != 2) {
            timestamp_registration = moment(timestamp_registration).subtract(time, 'hour').toDate()
        } else {
            timestamp_registration = moment(timestamp_registration).add(time, 'hour').toDate()
        }
    }


    var insertDataVisitor = {
        "personal_data": body.personal_data,
        "visitor_key": visitor_key,
        "purpose": body.purpose,
        "health": body.health,
        "status": 'registered',
        "client_key": body.client_key,
        "is_block": is_block,
        "reason_block": reason,
        "timestamp_blocked": date_blocked,
        "location": body.location,
        "timestamp_registration": timestamp_registration,
        "total_visitor": total_visitor,
        "visitor_id": visitor_id,
        "is_risk": is_risk
    }
    return insertDataVisitor
}
module.exports.restructVisitData = restructVisitData;
module.exports.restructUpdateForm = restructUpdateForm;
module.exports.restructVisitorData = restructVisitorData;
module.exports.restructUpdateData = restructUpdateData;
module.exports.sampleRestructVisitData = sampleRestructVisitData;
