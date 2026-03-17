package my.project.entity.repository;

import my.project.entity.MeetingRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoomEntity, Long> {

}
