import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema: mongoose.Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    sauces: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sauce',
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});


userSchema.pre('save', function(next) {
    const user: any = this;
    if (this.isModified('password') || user.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next();
            })
        })
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function(pw: any, cb: any) {
    const user: any = this;
    bcrypt.compare(pw, user.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    })
};


export default mongoose.model('User', userSchema);
