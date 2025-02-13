import test from 'ava';
import mongoose from 'mongoose';

// Define Collection model directly in test script
const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

const Collection = mongoose.model('Collection', CollectionSchema);

let collectionId;

// Connect to MongoDB before running tests
test.before(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to MongoDB");
    } catch (err) {
        console.log("MongoDB connection error:", err.message);
    }
});

// Close MongoDB connection after tests
test.after(async () => {
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    } catch (err) {
        console.log("Error closing MongoDB connection:", err.message);
    }
});

// Test adding a new collection
test('Should add a new collection', async (t) => {
    await mongoose.connect(process.env.MONGODB_URI);
    const newCollection = new Collection({
        name: 'Test Collection',
        description: 'This is a test collection',
    });

    const savedCollection = await newCollection.save();
    console.log("Saved collection:", savedCollection);

    t.truthy(savedCollection._id);
    t.is(savedCollection.name, newCollection.name);
    collectionId = savedCollection._id; // Store the created collection ID for later tests
});

// Test updating the collection
test('Should update the collection', async (t) => {
    const updatedData = {
        name: 'Updated Collection',
        description: 'Updated description',
    };

    const updatedCollection = await Collection.findByIdAndUpdate(collectionId, updatedData, { new: true });
    console.log("Updated collection:", updatedCollection);

    t.truthy(updatedCollection);
    t.is(updatedCollection.name, updatedData.name);
});

// Test deleting the collection
test('Should delete the collection', async (t) => {
    const deletedCollection = await Collection.findByIdAndDelete(collectionId);
    console.log("Deleted collection:", deletedCollection);

    t.truthy(deletedCollection);
    t.is(deletedCollection._id.toString(), collectionId.toString());
});
