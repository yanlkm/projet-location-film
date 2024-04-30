package com.locafilmback.controllers;

import com.locafilmback.dtos.PhotoDTO;
import com.locafilmback.dtos.PhotoBodyDTO;
import com.locafilmback.models.Commentaire;
import com.locafilmback.models.Film;
import com.locafilmback.models.Photo;
import com.locafilmback.services.CommentaireService;
import com.locafilmback.services.FilmService;
import com.locafilmback.services.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/photos")
public class PhotoController {

    private final PhotoService photoService;
    private final FilmService filmService;
    private final CommentaireService commentaireService;

    @Autowired
    public PhotoController(PhotoService photoService, FilmService filmService, CommentaireService commentaireService) {
        this.photoService = photoService;
        this.filmService = filmService;
        this.commentaireService = commentaireService;
    }

    @GetMapping("/films/{idFilm}")
    public ResponseEntity<List<PhotoDTO>> getPhotosByFilmId(@PathVariable int idFilm) {
        List<Photo> photos = photoService.getPhotosByFilmId(idFilm);
        List<PhotoDTO> photoDTOs = new ArrayList<>();
        for (Photo photo : photos) {
            PhotoDTO photoDTO = new PhotoDTO();
            photoDTO.setImage(photo.getImage());
            photoDTO.setIdPhoto(photo.getIdPhoto());
            photoDTOs.add(photoDTO);
        }
        return ResponseEntity.ok(photoDTOs);
    }

    @PostMapping("/films/{idFilm}")
    public ResponseEntity<Void> addPhotoForFilm(@PathVariable int idFilm, @RequestBody PhotoBodyDTO photoBodyDTO) {
        Film film = filmService.getFilmById(idFilm);
        if (film != null) {
            Photo photo = new Photo();
            photo.setImage(photoBodyDTO.getImage());
            photo.setFilm(film);
            photoService.addPhotoForFilm(idFilm, photo);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/commentaires/{idCommentaire}")
    public ResponseEntity<List<PhotoDTO>> getPhotosByCommentaireId(@PathVariable int idCommentaire) {
        List<Photo> photos = photoService.getPhotosByCommentaireId(idCommentaire);
        List<PhotoDTO> photoDTOs = new ArrayList<>();
        for (Photo photo : photos) {
            PhotoDTO photoDTO = new PhotoDTO();
            photoDTO.setImage(photo.getImage());
            photoDTO.setIdPhoto(photo.getIdPhoto());
            photoDTOs.add(photoDTO);
        }
        return ResponseEntity.ok(photoDTOs);
    }

    @PostMapping("/commentaires/{idCommentaire}")
    public ResponseEntity<Void> addPhotoForCommentaire(@PathVariable int idCommentaire, @RequestBody PhotoBodyDTO photoBodyDTO) {
        Commentaire commentaire = commentaireService.getCommentaireById(idCommentaire);
        if (commentaire != null) {
            Photo photo = new Photo();
            photo.setImage(photoBodyDTO.getImage());
            photo.setCommentaire(commentaire);
            photoService.addPhotoForCommentaire(idCommentaire, photo);
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }


    @DeleteMapping("/{idPhoto}")
    public ResponseEntity<Void> deletePhoto(@PathVariable int idPhoto) {
        photoService.deletePhoto(idPhoto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
