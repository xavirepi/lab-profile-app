const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema({
	username: {
		unique: true,
		type: String,
		required: 'Username is required',
		minLenght: [4, 'Username is not valid. It must be at least 4 characthers long.']
	  },
	password: {
		type: String,
		required: 'Password is required',
		minLength: [8, 'Password must have 8 characters or more']
	  },
	campus: {
		type: [String],
		required: 'Campus is required',
		enum: ['Madrid', 'Barcelona', 'Miami', 'Paris', 'Berlin', 'Amsterdam', 'México', 'Sao Paulo', 'Lisbon']
	  },
	course: {
		type: [String],
		required: 'Course is required',
		enum: ['Web Dev', 'UX/UI', 'Data Analytics', 'Cibersecurity']
	  },
	image: {
		type: String,
		validate: { // Mongoose method to validate images
		  validator: value => { // A value is passed
			try {
			  const url = new URL(value)
  
			  return url.protocol === 'http:' || url.protocol === 'https:' // If the value doesn't start like this most probably it won't be an image
			} catch(err) {
			  return false
			}
		  },
		  message: () => 'Invalid image URL' // This message is returned
		},
	  },
},
{
	timestamps: true,
	toJSON: {
		transform: (doc, ret) => {
			ret.id = doc._id
			delete ret._id
			delete ret._v
			delete ret.password
			return ret
		}
	}
}
)

// Password hash
userSchema.pre('save', function(next){
	if (this.isModified('password')) {
		bcrypt.hash(this.password, SALT_WORK_FACTOR)
			.then(hash => {
				this.password = hash
				next()
			})
	} else {
		next()
	}
});

userSchema.methods.checkPassword = function (passwordToCheck) {
	return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;