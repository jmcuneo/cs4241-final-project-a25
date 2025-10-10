import AccordionItem from '../components/AccordionItem';

function Recipes() {

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explore Recipes</h1><br/>
        <div className="w-full max-w-md mx-auto bg-white rounded-md shadow-md overflow-hidden">
          <AccordionItem title="Easy Pasta Dish">
            <p>
              <b>Servings:</b> 5<br/><br/>
              <b>Ingredients:</b><br/> 
              - One box of your favorite pasta<br/>
              - One lb of ground beef<br/>
              - One jar of your favorite tomato sauce<br/>
              <br/>
              <b>Instructions:</b><br/>
              First, start by boiling 4-6 quarts of water<br/>
              Once boiled, add the box of pasta to the water, and cook for the amount of time specified by the box. <br/><br/>
              While the pasta is cooking, place the 1lb ground beef in a large pan and break it apart with a wooden spoon. Do this until there is no visible pink in the beef<br/><br/>
              Once the meat is completely cooked through, pour the tomato sauce over it and let it simmer until the pasta has finished cooking. <br/><br/>
              Your pasta and meat sauce is ready! As an added bonus you can add extra toppings, such as parmasean or steamed broccoli. Enjoy!
              </p>
          </AccordionItem>
          <AccordionItem title="Stir Fry">
            <p>
              Stir fry is a beautiful dish where you can put just about anything in it and it will taste pretty ok, but here's how we recommend you make it.<br/><br/>
              <b>Servings:</b> 3<br/><br/>
              <b>Ingredients:</b><br/>
              1 cup of rice, 1 medium chicken breast, 1 head of broccoli, 2 carrots, 1 onion, 4 cloves of garlic, 2tbsp minced ginger, soy sauce, salt to taste<br/><br/>
              <b>Instructions:</b><br/>
              First, begin cooking 1 cup of rice in a rice cooker or on the stove.<br/>
              Next, dice your onion and add it to the bottom of your pot. Begin cooking on medium heat.<br/>
              While your onions are cooking, start cutting your chicken into approximately 1 inch cubes.<br/>
              Once the onions are see-through, add your chicken to the pot to begin cooking. Stir occasionally.<br/>
              While you wait for your chicken to cook all the way through, thinly slice your carrots, mince your garlic, and chop all of the florets of the broccoli into a seperate bowl.<br/>
              once the chicken is cooked all the way through, its time to add the vegetables. Add your carrots, broccoli, and garlic, and stir. Additionally, add two tablespoons of minced ginger, and pour approximately 4 tablespoons of soy sauce into the pot. Stir and enjoy!<br/>
            </p>
          </AccordionItem>
          <AccordionItem title="Simple Mashed Potatoes">
            <p>
              <b>Servings: </b> 1<br/><br/>
              <b>Ingredients:</b><br/>
              3 large potatoes, 2tbsp milk, 4tbsp butter, salt, garlic powder<br/><br/>
              <b>Instructions:</b><br/>
              First, cut the potatoes into 1 inch cubes.<br/>
              Fill your pot with 4 quarts of water, and add the chopped potatoes. Then, begin boiling the water. This will allow the potatoes to heat evenly.<br/>
              Cook the potatoes on a high heat for 15 minutes.<br/>
              Once they have finished cooking, drain the water, and use a potato masher to mash the potatoes.<br/>
              While mashing, add your 2tbsp of milk, and 4tbsp of butter. Mix well.<br/>
              Once done mixing, serve and enjoy! Add salt and garlic powder to taste
            </p>
          </AccordionItem>
        </div>
      </header>
    </div>
  );

}

export default Recipes;