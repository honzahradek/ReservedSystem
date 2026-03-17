package my.project.entity.repository;

import my.project.entity.ReservationEntity;
import my.project.entity.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long>, JpaSpecificationExecutor<ReservationEntity> {

    List<ReservationEntity> findByUser(UserEntity user);

    //Clear SQL, Find active Reservations
    @Query(value = "SELECT COUNT(*) FROM reservation WHERE status = 'PENDING' OR status = 'CONFIRMED'", nativeQuery = true)
    long activeReservation();

    //JPQL statement, Find last Reservations
    @Query("SELECT r FROM reservation r ORDER BY r.createdAt DESC")
    List<ReservationEntity> lastReservation(Pageable pageable);

    //JPQL statement
    @Query("SELECT r FROM reservation r WHERE r.room.id = :roomId")
    List<ReservationEntity> findByRoomId(@Param("roomId") Long roomId);

    /**
     * Finds overlapping reservations.
     * ExcludeID = ID of the reservation I am currently editing.
     * If we are creating a new reservation we will use excludeId = -1L.(ReservationServiceImpl)
     */
     @Query("""
      SELECT r FROM reservation r
      WHERE r.room.id = :roomId
      AND r.startTime < :endTime
      AND r.endTime > :startTime
      AND (:excludeId IS NULL OR r.reservationId <> :excludeId)
      """)
    List<ReservationEntity> findOverlappingReservations(
           @Param("roomId") Long roomId,
           @Param("startTime") LocalDateTime startTime,
           @Param("endTime") LocalDateTime endTime,
           @Param("excludeId") Long excludeId
    );


    //Find Overlapping confirmed reservations
    @Query("""
    SELECT r FROM reservation r
    WHERE r.room.id = :roomId
    AND r.status = my.project.constant.ReservationStatus.CONFIRMED
    AND (
        (r.startTime < :endTime AND r.endTime > :startTime)
    )
    """)
    List<ReservationEntity> findOverlappingConfirmed(
            Long roomId,
            LocalDateTime startTime,
            LocalDateTime endTime
    );
}
