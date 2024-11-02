import { collection, getDocs } from "./firebase.mjs";
import fs from 'fs';
import csv from 'csv-parser';

export async function getUserData() {
  const querySnapshot = await getDocs(collection(db, "users"));
  let userData = [];
  querySnapshot.forEach((doc) => {
    userData.push(doc.data());
  });
  return userData;
}

export function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    let results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export async function combineData() {
  const userData = await getUserData();
  const csvData = await readCSV('src/data/NutrientValues.csv');
  let combinedData = userData.map(user => {
    let nutrientData = csvData.find(item => item['Main food description'] === user.food);
    return {
      ...user,
      nutrientData
    };
  });

  return combinedData;
}