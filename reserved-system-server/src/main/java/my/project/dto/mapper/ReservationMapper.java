package my.project.dto.mapper;

import my.project.dto.ReservationDTO;
import my.project.entity.ReservationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    ReservationDTO toDTO(ReservationEntity reservationEntity);
    ReservationEntity toEntity(ReservationDTO reservationDTO);

    @Mapping(target = "room", ignore = true)
    @Mapping(target = "user", ignore = true)
    void editReservation(ReservationDTO source, @MappingTarget ReservationEntity target);
}
