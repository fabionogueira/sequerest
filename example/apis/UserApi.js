const Api = require('../../src/api');
const Authenticate = require('../config/auth');
const db = require('../config/db');

class UserApi extends Api {
    read(res) {
        let sqModel = this.getModel();
        let options = this.getReadOptions();
        let models = db.getModels();

        options.include = [{
            model: models.posts,
            include: [{
                model: models.comments
            }]
        }];

        sqModel.findAll(options)
            .then(users => {
                const resObj = users.map(user => {
                    //tidy up the user data
                    return Object.assign({}, {
                        user_id: user.id,
                        username: user.username,
                        role: user.role,
                        posts: user.posts.map(post => {

                            //tidy up the post data
                            return Object.assign({}, {
                                post_id: post.id,
                                // user_id: post.user_id,
                                content: post.content,
                                comments: post.comments.map(comment => {

                                    //tidy up the comment data
                                    return Object.assign({}, {
                                        comment_id: comment.id,
                                        // post_id: comment.post_id,
                                        commenter: comment.commenter_username,
                                        commenter_email: comment.commenter_email,
                                        content: comment.content
                                    });
                                })
                            });
                        })
                    });
                });

                res.status(200).json(resObj);
            })
            .catch(error => {
                res.status(500).json({
                    error: error.message
                });
            });
    }
}

module.exports = new UserApi({
    model: db.getModel('users'),
    ordering_fields:['id'],
    authentication_classe: Authenticate
});
