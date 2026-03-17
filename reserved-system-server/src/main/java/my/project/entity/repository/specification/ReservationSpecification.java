package my.project.entity.repository.specification;

import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import my.project.entity.*;
import my.project.entity.filter.ReservationFilter;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class ReservationSpecification  implements Specification<ReservationEntity> {
    private final ReservationFilter filter;

    @Override
    public Predicate toPredicate(Root<ReservationEntity> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        if (filter.getRoomID() != null) {
            Join<MeetingRoomEntity, ReservationEntity> roomJoin = root.join(ReservationEntity_.ROOM);
            predicates.add(criteriaBuilder.equal(roomJoin.get(MeetingRoomEntity_.ROOM_ID), filter.getRoomID()));
        }

        if (filter.getUserID() != null) {
            Join<UserEntity, ReservationEntity> userJoin = root.join(ReservationEntity_.USER);
            predicates.add(criteriaBuilder.equal(userJoin.get(UserEntity_.USER_ID), filter.getUserID()));
        }

        if (filter.getStartTime() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(ReservationEntity_.START_TIME), filter.getStartTime()));
        }

        if (filter.getEndTime() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(ReservationEntity_.END_TIME), filter.getEndTime()));
        }

        if (filter.getStatus() != null) {
            predicates.add(criteriaBuilder.equal(root.get(ReservationEntity_.STATUS), filter.getStatus()));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
