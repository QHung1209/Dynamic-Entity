import { MongoClient, Db } from 'mongodb';

let client: MongoClient;

export async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(
      'mongodb+srv://hunglyquoc2003:Timetolove0.@cluster0.zvfrd.mongodb.net',
    );
    await client.connect();
  }
  return client;
}

export async function getDb(): Promise<Db> {
  const mongoClient = await getMongoClient();
  return mongoClient.db('dynamic');
}
