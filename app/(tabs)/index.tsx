import { ScrollView, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import colors from '../colors';
import { useEffect, useState } from 'react';
import { Meal } from '../types/Meal';
import { Image } from 'expo-image';
import Entypo from '@expo/vector-icons/Entypo';
import { Category } from '../types/Category';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function TabOneScreen() {
    const [randomMeal, setRandomMeal] = useState<Meal>()
    const [categories, setCategories] = useState<Category[]>()
    const [myRecipes, setMyRecipes] = useState<any[]>()

   useEffect(() => {
    const bootstrapAsync = async () => {
        const randomMealResponse = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        const randomMealData = await randomMealResponse.json()

        const cateogriesResponse = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        const categoriesData = await cateogriesResponse.json()

        const { meals } = randomMealData
        const { categories } = categoriesData

        setRandomMeal(meals[0])
        setCategories(categories)

        const myRecipes = await AsyncStorage.getItem('my_recipes')
        if (myRecipes) {
            setMyRecipes(JSON.parse(myRecipes))
        }
    }
    bootstrapAsync()
   }, []) 

   console.log(myRecipes[2])

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Don’t know what to cook?</Text>
        <View style={styles.randomMealContainer}>
            <Text style={{marginBottom: 10, fontSize: 20, fontWeight: 'bold', color: colors.secondary}}>Random Meal</Text>
            <View style={styles.randomMealInner}>
                <Image
                    style={styles.randomMealImage}
                    source={randomMeal?.strMealThumb}
                />
                <View style={styles.randomMealText}>
                    <Text style={{fontSize: 18, color: colors.secondary, paddingBottom: 10}}>
                        {randomMeal?.strMeal}
                    </Text>
                    <View style={{flexDirection: 'row', backgroundColor: colors.tertiary, gap: 15}}>
                        <View style={{backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', padding: 3, borderRadius: 10, flexDirection: 'row'}}>
                            <Entypo name="flag" />
                            <Text>
                                {randomMeal?.strArea}
                            </Text>
                        </View>
                        <View style={{backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', padding: 3, borderRadius: 10, flexDirection: 'row'}}>
                            <Entypo name="grid" />
                            <Text>
                                {randomMeal?.strCategory}
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', gap: 4, marginTop: 10, backgroundColor: colors.tertiary}}>
                        {randomMeal?.strTags?.split(',').map(tag => (
                            <View style={{backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', padding: 3, borderRadius: 10, flexDirection: 'row'}}>
                                <Entypo name="tag" />
                                <Text>
                                    {tag}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 40, justifyContent: 'space-between', backgroundColor: colors.primary}}>
            <Text style={{fontSize: 18, color: colors.secondary}}>Categories</Text>
            <Text style={{color: colors.secondary}}>View All</Text>
        </View>
        <ScrollView horizontal contentContainerStyle={{height: 100, gap: 12, marginTop: 20}}>
            {categories?.map((category, index) => (
                <View key={index} style={{backgroundColor: colors.secondary, borderRadius: 10}}>
                    <Image
                        style={styles.randomMealImage}
                        source={category.strCategoryThumb}
                    />
                    <Text style={{color: colors.secondary}}>
                        {category.strCategory}
                    </Text>
                </View>
            ))}
        </ScrollView>
        {myRecipes?.map((recipe, index) => (
            <View key={index}>
                <Text>{recipe.title}</Text>
                {/* {recipe.ingredients.map((ingredient, index) => (
                    <Text key={index}>{ingredient}</Text>
                ))}
                {recipe.instructions.map((instruction, index) => (
                    <Text key={index}>{instruction}</Text>
                ))} */}
            </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.primary
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary
  },
  randomMealContainer: {
    backgroundColor: colors.tertiary,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  randomMealInner: {
    backgroundColor: colors.tertiary,
    flexDirection: 'row',
    marginTop: 10,
  },
  randomMealText: {
    backgroundColor: colors.tertiary,
    marginLeft: 20,
    padding: 5
  },
  randomMealImage: {
    width: 100,
    height: 100,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
