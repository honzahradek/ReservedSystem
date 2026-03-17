package my.project.controller.advice;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Central place for error handling.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * The requested record is not found (user, reservation, room, etc.). Send back status 404 + simple JSON message
     */
    @ExceptionHandler({ChangeSetPersister.NotFoundException.class, EntityNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Map<String, String>> handleEntityNotFoundException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage() != null
                ? ex.getMessage()
                : "Requested record was not found.");

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400
    public ResponseEntity<Map<String, String>> handleIllegalStateException(IllegalStateException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage() != null ? ex.getMessage() : "Illegal state occurred.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles IllegalArgumentException thrown within the application.
     *
     * This method returns a simple JSON response containing the error message.
     * It is typically used in a global exception handler (e.g. @ControllerAdvice)
     * to provide a consistent error format for invalid input or arguments.
     *
     * @param ex the thrown IllegalArgumentException
     * @return a map containing the error message that will be serialized to JSON
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgument(IllegalArgumentException ex) {
        return Map.of("error", ex.getMessage());
    }

    /**
     * Handles all unexpected exceptions that were not caught by more specific handlers.
     *
     * This method acts as a fallback error handler to prevent the application
     * from exposing internal details to the client. The exception stack trace
     * is printed to the server logs for debugging purposes, while the client
     * receives a generic error message.
     *
     * @param ex the unexpected exception that occurred
     * @return a map containing a generic error message that will be returned as JSON
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleGeneral(Exception ex) {
        ex.printStackTrace();
        return Map.of("error", "Unexpected error occurred.");
    }
}
