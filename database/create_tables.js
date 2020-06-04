const conference = require('../models/conference');
const country = require('../models/country');
const coupen_codes = require('../models/coupen_codes');
const review_store = require('../models/review_store');
const subject = require('../models/subject');
const submissions = require('../models/submissions');
const tickets = require('../models/tickets');
const user = require('../models/user');
const userroles = require('../models/userroles');

const conference_has_coupen = require('../models/table_relations/conference_has_coupen');
const conference_has_tickets = require('../models/table_relations/conference_has_tickets');
const submission_has_rstore = require('../models/table_relations/submission_has_rstore');
const submission_has_subject = require('../models/table_relations/submission_has_subject');
const submission_reviewdby = require('../models/table_relations/submission_reviewdby');
const user_belongsto_country = require('../models/table_relations/user_belongsto_country');
const user_buy_ticket = require('../models/table_relations/user_buy_ticket');
const user_has_role = require('../models/table_relations/user_has_role');
const user_sudmitted = require('../models/table_relations/user_sudmitted');

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
    conference.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "conference");
    });

    country.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "country");
    });

    coupen_codes.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "coupen_codes");
    });

    review_store.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "review_store");
    });

    subject.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "subject");
    });

    submissions.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "submissions");
    });

    tickets.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "tickets");
    });

    user.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "user");
    });

    userroles.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "userroles");
    });

    conference_has_coupen.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "conference_has_coupen");
    });

    conference_has_tickets.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "conference_has_tickets");
    });

    submission_has_rstore.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "submission_has_rstore");
    });

    submission_has_subject.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "submission_has_subject");
    });

    submission_reviewdby.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "submission_reviewdby");
    });

    user_belongsto_country.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "user_belongsto_country");
    });

    user_buy_ticket.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "user_buy_ticket");
    });

    user_has_role.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "user_has_role");
    });

    user_sudmitted.sync({ force: false })
    .then(() => {
        created();
    })
    .catch(err => {
        errCreating(err, "user_sudmitted");
    });
};