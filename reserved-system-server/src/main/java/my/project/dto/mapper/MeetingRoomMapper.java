package my.project.dto.mapper;

import my.project.dto.MeetingRoomDTO;
import my.project.entity.MeetingRoomEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MeetingRoomMapper {

    MeetingRoomEntity toEntity(MeetingRoomDTO source);
    MeetingRoomDTO toDTO(MeetingRoomEntity source);

    void editRoom(MeetingRoomDTO source, @MappingTarget MeetingRoomEntity target);
}
