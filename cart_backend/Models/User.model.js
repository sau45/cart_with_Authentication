import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

UserSchema.methods.isPasswordValid = async function(password){
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
}


const User = mongoose.model('user', UserSchema);
export default User;
