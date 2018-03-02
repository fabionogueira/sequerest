// insere dados iniciais no banco de dados

const DATA = {
    users: [
        {id:'1', username:'larrycool', role:'user'},
        {id:'2', username:'jimmy_jonez', role:'admin'}
    ],
    posts: [
        {id:'1', user_id:'2', content:'This is larrycool\'s first post.'},
        {id:'2', user_id:'2', content:'This is larrycool\'s second post.'},
        {id:'3', user_id:'1', content:'This is jimmy_jonez\'s first post.'},
        {id:'4', user_id:'1', content:'This is jimmy_jonez\'s second post.'}
    ],
    comments: [
        {post_id:'1', commenter_username:'scuba_human', commenter_email:'swim@gmail.com', content:'Very interesting, but have you hear of shark week?', status:'approved'},
        {post_id:'1', commenter_username:'jabber_jabs', commenter_email:'sillystring@hotmail.com', content:'I completely disagree, because bagels.', status:'in review'},
        {post_id:'2', commenter_username:'terry_mcmuffin', commenter_email:'teacherlady@yahoo.com', content:'I think the children would devour this.', status:'approved'},
        {post_id:'4', commenter_username:'vortex', commenter_email:'blackmagic@gmail.com', content:'Mixy, mix, the poison potion.', status:'rejected'}
    ]
};

module.exports = (DB)=>{
    let fs = require('fs');
    let file = __dirname + '/db.data.exists';
    let insert = (table, row) => {
        DB[table].create(row)
        .then(record => {
            console.log(table, 'insert row', JSON.stringify(record));
        })
        .catch(error => {
            throw error;
        });
    };

    if (!fs.existsSync(file)) {
        Object.keys(DATA).forEach(table => {
            let rows = DATA[table];
        
            rows.forEach(row => {
                insert(table, row);
            });
        });
    }

    fs.closeSync(fs.openSync(file, 'a'));
};
