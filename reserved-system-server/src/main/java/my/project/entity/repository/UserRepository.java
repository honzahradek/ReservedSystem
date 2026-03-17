package my.project.entity.repository;

import my.project.constant.Role;
import my.project.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsById(Long id);

    boolean existsByRole(Role role);

    boolean existsByEmail(String email);

}
