package main

import (
	"golang-app/database"
	"golang-app/models"
	"log"
	"time"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

func main() {
	database.ConnectDB()

	database.DB.AutoMigrate(&models.ToDo{})

	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	// Rutas
	app.Get("/api/todos", GetToDos)
	app.Get("/api/todos/:id", GetToDo)
	app.Post("/api/todos", CreateToDo)
	app.Put("/api/todos/:id", UpdateToDo)
	app.Delete("/api/todos/:id", DeleteToDo)

	log.Fatal(app.Listen(":3000"))
}

// Obtener todos los ToDos
func GetToDos(c *fiber.Ctx) error {
	var todos []models.ToDo
	database.DB.Find(&todos)
	return c.JSON(todos)
}

// Obtener un ToDo por ID
func GetToDo(c *fiber.Ctx) error {
	id := c.Params("id")
	var todo models.ToDo
	result := database.DB.First(&todo, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "ToDo no encontrado",
		})
	}
	return c.JSON(todo)
}

// Crear un nuevo ToDo
func CreateToDo(c *fiber.Ctx) error {
	todo := new(models.ToDo)

	if err := c.BodyParser(todo); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Datos inválidos",
		})
	}

	todo.CreationDate = time.Now()
	database.DB.Create(&todo)
	return c.Status(201).JSON(todo)
}

// Actualizar un ToDo existente
func UpdateToDo(c *fiber.Ctx) error {
	id := c.Params("id")
	var todo models.ToDo
	result := database.DB.First(&todo, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "ToDo no encontrado",
		})
	}

	if err := c.BodyParser(&todo); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Datos inválidos",
		})
	}

	database.DB.Save(&todo)
	return c.Status(204).JSON(todo)
}

// Eliminar un ToDo
func DeleteToDo(c *fiber.Ctx) error {
	id := c.Params("id")
	var todo models.ToDo
	result := database.DB.First(&todo, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "ToDo no encontrado",
		})
	}

	database.DB.Delete(&todo)
	return c.SendStatus(200)
}
