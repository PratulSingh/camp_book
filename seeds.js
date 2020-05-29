    const Campground = require('./models/campground');
    const Comment = require('./models/comment');
    const User = require('./models/user');
     
    const dummyUser = { name: 'Dummy User', password: 'dummyuser' };
     
    const seeds = [
      {
        name: "Cloud's Rest",
        image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      },
      {
        name: 'Desert Mesa',
        image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      },
      {
        name: 'Canyon Floor',
        image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      },
    ];
     
    async function seedDB() {
      try {
        // Delete all Collections
        await Comment.deleteMany({});
        await Campground.deleteMany({});
        await User.deleteMany({});
     
        // Add Dummy User to the Database
        let dummyAuthor = await User.findOne({ username: dummyUser.username });
        if (!dummyAuthor) {
          const newUser = new User({ username: 'Dummy User' });
          dummyAuthor = await User.register(newUser, dummyUser.password);
        }
     
        seeds.forEach(async (seed) => {
          // Create Campground & Comment
          const campground = await Campground.create(seed);
          const comment = await Comment.create({
            text: 'This place is great, but I wish there was internet',
          });
     
          // Associate Dummy Author to Campground
          campground.author.id = dummyAuthor._id;
          campground.author.username = dummyAuthor.username;
     
          // Associate Dummy Author to Comments
          comment.author.username = dummyAuthor.username;
          comment.author.id = dummyAuthor._id;
          comment.save();
     
          // Add Comment to the Campground
          campground.comments.push(comment);
          campground.save();
        });
      } catch (err) {
        console.log(err);
      }
    }
     
    module.exports = seedDB;
	   
	   
	   