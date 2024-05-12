import {
  Stat,
  StatLabel,
  StatNumber,
  Box,
  SimpleGrid,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import "../styles/fonts/material-design-iconic-font/css/material-design-iconic-font.min.css";

import { SearchIcon } from "@chakra-ui/icons";

import "../styles/Dashboard/styles.css";

import food from "../styles/images/food.png";
import workout from "../styles/images/workout.png";
import net from "../styles/images/net calories.png";
import balance from "../styles/images/balance.png";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const UserDashboard = () => {
  const mealModal = useDisclosure();
  const workoutModal = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const { auth } = useContext(AuthContext);

  const [searchMeal, setSearchMeal] = useState("");
  const [searchWorkout, setSearchWorkout] = useState("");

  const [fetchedFood, setFetchedFood] = useState(null);

  const [addNewFood, setAddNewFood] = useState([]);

  const fetchSearchMeal = () => {
    fetch(`http://localhost:3000/foods/search/?name=${searchMeal}`, {
      headers: {
        "content-type": "application/json",
        authorization: auth.accessToken,
      },
    })
      .then((response) => response.json())
      .then((responseData) => setFetchedFood(responseData.data))
      .catch((error) => console.log(error));
  };

  const addSelectedFoodToDB = () => {
    const newData = addNewFood.map((foods) => {
      return { food: foods.food, quantity: foods.quantity };
    });

    console.log(newData);

    fetch("http://localhost:3000/meals/addMeal", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: auth.accessToken,
      },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then((responseData) => console.log(responseData))
      .catch((error) => console.log(error));
  };

  const fetchSearchWorkout = () => {
    console.log(searchWorkout);
  };

  return (
    <>
      <div>
        <div
          className="dashboardContainer"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <div className="goalCard">
            <div className="parent">
              <div className="card">
                <div className="content-box">
                  <Stat>
                    <StatLabel className="see-more">Goal</StatLabel>
                    <br />
                    <StatNumber className="card-title">
                      2870{" "}
                      <span style={{ fontSize: "15px", fontWeight: "500" }}>
                        Cal
                      </span>
                    </StatNumber>
                    <p className="card-content">Calories required</p>
                    {/* <StatHelpText>
                <StatArrow
                  type="increase"
                  style={{
                    color: "#3bed4b",
                    width: "30px",
                    height: "30px",
                  }}
                />
                23.36%
              </StatHelpText> */}
                  </Stat>
                </div>
                <div className="date-box">
                  <span className="month">
                    {
                      [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ][new Date().getMonth()]
                    }
                  </span>
                  <span className="date">{new Date().getDate()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mealCard">
            <div className="card work">
              <div
                className="img-section"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <img src={food} alt="" height="30px" width="45px" />
              </div>
              <div className="card-desc">
                <div className="card-header">
                  <div className="card-title">Food</div>
                  <div className="card-menu">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
                <div className="card-time">32hrs</div>
                <p className="recent">Last Week-36hrs</p>
              </div>
            </div>
          </div>

          <div className="mealCard">
            <div className="card work">
              <div
                className="img-section"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img src={workout} alt="" height="29px" width="70px" />
              </div>
              <div className="card-desc">
                <div className="card-header">
                  <div className="card-title">Workout</div>
                  <div className="card-menu">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
                <div className="card-time">32hrs</div>
                <p className="recent">Last Week-36hrs</p>
              </div>
            </div>
          </div>

          <div className="mealCard">
            <div className="card work">
              <div
                className="img-section"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img src={net} alt="" height="30px" width="45px" />
              </div>
              <div className="card-desc">
                <div className="card-header">
                  <div className="card-title">Net Calorie</div>
                  <div className="card-menu">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
                <div className="card-time">32hrs</div>
                <p className="recent">Last Week-36hrs</p>
              </div>
            </div>
          </div>

          <div className="mealCard">
            <div className="card work">
              <div
                className="img-section"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img src={balance} alt="" height="50px" width="70px" />
              </div>
              <div className="card-desc">
                <div className="card-header">
                  <div className="card-title">Balance Calorie</div>
                  <div className="card-menu">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
                <div className="card-time">32hrs</div>
                <p className="recent">Last Week-36hrs</p>
              </div>
            </div>
          </div>
        </div>
        <Box
          bgGradient="linear(to-tr, #595732, #3f3f3a)"
          minH="100vh"
          color="white"
          mt={2}
        >
          <Box>
            <SimpleGrid
              columns={{ sm: 1, md: 1, lg: 2 }}
              spacing="8"
              pl="10"
              pr="10"
              textAlign="center"
              color="gray.400"
            >
              <Box boxShadow="base" p="6" rounded="md" bg="white">
                <Button
                  size="md"
                  height="40px"
                  width="150px"
                  border="2px"
                  borderColor="green.500"
                  onClick={mealModal.onOpen}
                >
                  Add Meal
                </Button>
              </Box>

              <Box boxShadow="base" p="6" rounded="md" bg="white">
                <Button
                  size="md"
                  height="40px"
                  width="150px"
                  border="2px"
                  borderColor="green.500"
                  onClick={workoutModal.onOpen}
                >
                  Add Workout
                </Button>
              </Box>
            </SimpleGrid>
          </Box>
        </Box>

        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={mealModal.isOpen}
          size={"full"}
          onClose={mealModal.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Meal</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} width={{ sm: "100%", md: "50%" }} mx={"auto"}>
              <FormControl>
                <FormLabel>Meal</FormLabel>
                <Box display={"flex"} gap={2}>
                  <Input
                    ref={initialRef}
                    placeholder="Search Meal"
                    value={searchMeal}
                    onChange={(e) => {
                      setSearchMeal(e.target.value);
                    }}
                  />
                  <IconButton
                    colorScheme="blue"
                    aria-label="Search database"
                    icon={<SearchIcon />}
                    onClick={fetchSearchMeal}
                  />
                </Box>
              </FormControl>
              <div>
                {addNewFood.length > 0 && (
                  <p style={{ fontWeight: "500", marginTop: "10px" }}>
                    Added Meal
                  </p>
                )}
                {addNewFood.length > 0 &&
                  addNewFood.map((item) => {
                    return (
                      <p
                        key={item.food}
                        style={{ fontSize: " 14px", padding: "3px 0px" }}
                      >
                        <button
                          onClick={() => {
                            const foodId = item.food;

                            const newFood = addNewFood.filter((fooditem) => {
                              return fooditem.food != foodId;
                            });

                            setAddNewFood([...newFood]);
                          }}
                        >
                          <i className="zmdi zmdi-close-circle"> </i>{" "}
                          &nbsp;&nbsp;&nbsp;
                        </button>
                        {item.name} : Qty {item.quantity}
                      </p>
                    );
                  })}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                {fetchedFood &&
                  fetchedFood.map((food) => {
                    return (
                      <div
                        key={food._id}
                        style={{
                          width: "100%",
                          maxWidth: "350px",
                          boxShadow:
                            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                          borderRadius: "10px",
                          padding: "10px",
                          boxSizing: "border-box",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            margin: "5px 0px",
                          }}
                        >
                          {food.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>Serving size : {food.servingSize}</p>
                          <p style={{}}>Calories : {food.calories} cal</p>
                        </div>

                        <div
                          style={{
                            display: "flex ",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <p style={{ fontSize: "14px" }}>
                              Proteins : {food.macros.protein}
                            </p>
                            <p style={{ fontSize: "14px" }}>
                              Carbs : {food.macros.carbs}
                            </p>
                            <p style={{ fontSize: "14px" }}>
                              Fat : {food.macros.fat}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <span>Qty.</span>
                            <input
                              type="number"
                              name=""
                              id=""
                              defaultValue={0}
                              style={{
                                width: "70px",
                                border: "1px solid #818181",
                                borderRadius: "5px",
                                min: 1,
                              }}
                              onChange={(e) => {
                                console.log(e.target.value);

                                if (e.target.value >= 0) {
                                  const foodId = food._id;
                                  const newFood = addNewFood.filter((item) => {
                                    return item.food != foodId;
                                  });

                                  if (e.target.value > 0) {
                                    setAddNewFood([
                                      ...newFood,
                                      {
                                        food: foodId,
                                        name: food.name,
                                        quantity: e.target.value,
                                      },
                                    ]);
                                  } else {
                                    setAddNewFood([...newFood]);
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={addSelectedFoodToDB}>
                Save
              </Button>
              <Button onClick={mealModal.onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={workoutModal.isOpen}
          size={"full"}
          onClose={workoutModal.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Workout</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6} width={{ sm: "100%", md: "50%" }} mx={"auto"}>
              <FormControl>
                <FormLabel>Workout</FormLabel>
                <Box display={"flex"} gap={2}>
                  <Input
                    ref={initialRef}
                    placeholder="Search Workout"
                    value={searchWorkout}
                    onChange={(e) => {
                      setSearchWorkout(e.target.value);
                    }}
                  />
                  <IconButton
                    colorScheme="blue"
                    aria-label="Search database"
                    icon={<SearchIcon />}
                    onClick={fetchSearchWorkout}
                  />
                </Box>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={workoutModal.onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export { UserDashboard };
