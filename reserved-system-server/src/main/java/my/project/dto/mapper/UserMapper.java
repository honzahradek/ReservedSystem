package my.project.dto.mapper;

import my.project.dto.UserDTO;
import my.project.entity.UserEntity;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface UserMapper {

   UserDTO toDTO(UserEntity source);



}
