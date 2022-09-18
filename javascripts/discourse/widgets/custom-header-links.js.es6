import hbs from 'discourse/widgets/hbs-compiler';
import { createWidget } from 'discourse/widgets/widget';
import { withPluginApi } from "discourse/lib/plugin-api";
import { action } from '@ember/object';

createWidget('custom-header-links', {
  tagName: 'nav.custom-header-links',
  buildKey: (attrs) => `custom-header-links-${attrs.id}`,
  
  buildClasses(attrs) {
    const { scrolling } = attrs;
    const classes = [];

    if (scrolling) {
      classes.push('scrolling');
    }

    return classes;
  },

  transform(attrs) {
    const { headerLinks } = attrs;
    
    if(this.state.items2.length == this.state.user_tags.length || !this.state.isAuthor) {
      return {
        headerLinks
      };
    }
    else {
      this.state.user_tags.forEach((tag) => {
        var description = ""
        this.store.find("tag-info", tag).then(data => {
            description = data.description; // data["topic_list"]["tags"][0]["description"];
            this.state.items2.push({ "title": tag, "url": "/tag/" + tag,  "description": description})
            if(this.state.items2.length == this.state.user_tags.length) {
              this.state.isLoading = false;
              this.state.items2.sort(function(a, b) {
                a = a["title"];
                b = b["title"];
                return parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]) || parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]);
              });
              this.state.items2.reverse();
              sessionStorage.setItem("user-papers", JSON.stringify(this.state.items2));
              this.scheduleRerender();
            }
        });
      });
    }
    
    return {
      headerLinks
    };
  },

  defaultState() {
    let showLinks = !this.site.mobileView;
    const mobileView = this.site.mobileView;
    const currentUser = withPluginApi("1.2.0", (api) => {
      return api.getCurrentUser();
    });
    let user_tags = currentUser.custom_fields["tags"];
    let isAuthor = user_tags != undefined;
    user_tags = [user_tags].flat();
    
    let items2 = [];
    let isLoading = true;
    if (sessionStorage.getItem("user-papers") !== null ) {
      if(user_tags.length !== JSON.parse(sessionStorage.getItem("user-papers")).length) {
        items2 = [];
      }
      else {
        items2 = JSON.parse(sessionStorage.getItem("user-papers"));
        isLoading = false;
      }
    }
    
    
    return {
      mobileView,
      showLinks,
      user_tags,
      isLoading,
      items2,
      isAuthor
    };
  },

  showHeaderLinks() {
    this.state.showLinks = !this.state.showLinks;
  },

  template: hbs`
    {{#if this.state.isAuthor}}
    {{#if this.state.mobileView}}
      <span class="btn-custom-header-dropdown-mobile">
        {{attach
            widget="button"
            attrs=(hash
              action="showHeaderLinks"
              icon="caret-square-down"
            )
        }}
      </span>
    {{/if}}
    {{#if this.state.showLinks}}
      <ul class="top-level-links" tabindex="0">
        <li title="My Papers" class="custom-header-link">
        <span class="custom-header-link-icon">
            {{d-icon 'book'}}
        </span>
        <span class="custom-header-link-title">My Papers</span>
        <span
            class="custom-header-link-caret">
            {{d-icon 'caret-down'}}
        </span>
        
          <ul id="customHeaderDropdown" class="custom-header-dropdown">
          {{#if this.state.isLoading}}
            <div class="spinner-container">
              <div class="spinner"></div>
            </div>
          {{/if}}
          {{#unless this.state.isLoading}}
          <input id="myPapersSearchBar" type="text" placeholder="Search..."/>
            {{#each this.state.items2 as |item|}}
              <a href={{item.url}}>
              <li title={{item.title}} class="custom-header-dropdown-link">
                  <span class="custom-header-link-icon">
                    {{d-icon 'scroll'}}
                  </span>
                  <span class="custom-header-link-title">{{item.title}}</span><span
                      class="custom-header-link-desc">{{item.description}}</span>
              </li>
              </a>
            {{/each}}
          {{/unless}}
          </ul> 
        </li>
      </ul>
    {{/if}}
    {{/if}}
  `,
});
