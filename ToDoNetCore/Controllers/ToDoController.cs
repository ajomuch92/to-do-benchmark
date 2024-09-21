using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoNetCore.Models;

namespace ToDoNetCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private Ajomuch92ToDoContext _context;

        public ToDoController(Ajomuch92ToDoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<ToDo>> Get()
        {
            return await _context.ToDos.ToListAsync();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ToDo), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.ToDos.FindAsync(id);
            return product == null ? NotFound() : Ok(product);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create(ToDo toDo)
        {
            await _context.ToDos.AddAsync(toDo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = toDo.Id }, toDo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ToDo toDo)
        {
            if (id != toDo.Id) return BadRequest();
            _context.Entry(toDo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var toDoToDelete = await _context.ToDos.FindAsync(id);
            if (toDoToDelete == null) return NotFound();

            _context.ToDos.Remove(toDoToDelete);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
