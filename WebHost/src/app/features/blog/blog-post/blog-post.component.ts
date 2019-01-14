import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { BlogService } from '../services/blog.service';
import { BlogPost } from '../models/blog-post.model';
import { RoutingService } from 'src/app/core/routing/routing.service';
import { ComponentBase } from 'src/app/core/component/component-base';
import { MarkdownService } from 'src/app/core/formatter/markdown.service';

@Component({
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogPostComponent extends ComponentBase implements OnInit {

  post: BlogPost;

  get isNew() { return this.post.id === '-1'; }

  constructor(private blogService: BlogService, private route: ActivatedRoute, private router: RoutingService, private markdown: MarkdownService) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(parms => this.getData(parms.id));
  }

  getData(id: string) {
    if (id === '-1') {
      const todayDate = new Date();
      const today = todayDate.getFullYear() + '-' + todayDate.getMonth() + 1 + '-' + todayDate.getDate();
      this.post = new BlogPost({ id: id, title: 'New Blog Post', content: '', date: today }, this.markdown);
      return;
    }

    this.blogService.get(id).subscribe(blogPost => {
      this.post = blogPost;
    });
  }

  navigate(id: string) {
    this.router.gotoBlogPost(id);
  }

  navigateToProfile() {
    this.router.gotoAbout();
  }
}

