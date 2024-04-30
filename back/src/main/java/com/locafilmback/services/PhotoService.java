package com.locafilmback.services;

import com.locafilmback.models.Photo;
import com.locafilmback.repositories.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;

    @Autowired
    public PhotoService(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    public List<Photo> getPhotosByFilmId(int idFilm) {
        return photoRepository.findByFilm_IdFilm(idFilm);
    }

    public void addPhotoForFilm(int idFilm, Photo photo) {
        photo.getFilm().setIdFilm(idFilm);
        photoRepository.save(photo);
    }

    public List<Photo> getPhotosByCommentaireId(int idCommentaire) {
        return photoRepository.findByCommentaire_IdCommentaire(idCommentaire);
    }

    public void addPhotoForCommentaire(int idCommentaire, Photo photo) {
        photo.getCommentaire().setIdCommentaire(idCommentaire);
        photoRepository.save(photo);
    }

    public void deletePhoto(int idPhoto) {
        photoRepository.deleteById(idPhoto);
    }
}
