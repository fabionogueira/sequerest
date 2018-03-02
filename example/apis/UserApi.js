const Api = require('../../src/Api');
const db = require('../config/db');

class UserApi extends Api {
    read(res) {
        let sqModel = this.getModel();
        let options = this.getKeyFilters() || {};

        options.include = [{
            model: db.posts,
            include: [{
                model: db.comments
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
                                user_id: post.user_id,
                                content: post.content,
                                comments: post.comments.map(comment => {

                                    //tidy up the comment data
                                    return Object.assign({}, {
                                        comment_id: comment.id,
                                        post_id: comment.post_id,
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
                    error: error.original.code
                });
            });
    }
}

module.exports = new UserApi(db.getModel('users'));